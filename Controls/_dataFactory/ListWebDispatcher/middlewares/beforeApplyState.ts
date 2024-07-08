import { TListAction } from '../types/TListAction';
import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { isEqual } from 'Types/object';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import type { IMarkerState } from 'Controls/listAspects';
import { calculateBreadcrumbsData } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { IListState } from '../../interface/IListState';
import { CrudEntityKey, Rpc } from 'Types/source';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import type { ISelection, TFilter, TKey } from 'Controls-DataEnv/interface';

import { AspectsNames } from '../../AbstractList/_interface/AspectsNames';
import { AbstractListSlice } from '../../AbstractList/AbstractListSlice';
import { getSearchResolver } from '../../AbstractList/utils/getSearchResolver';
import { hasItemInArray } from '../../AbstractList/utils/itemUtils';
import { TLoadResult } from '../../List/Slice';
import { resolveSearchViewMode } from '../../List/utils';
import getStateAfterLoadError from '../../List/resources/error';

import { resolveModuleWithCallback } from './_loadModule';
import { getSourceControllerOptions } from './_loadData';
import { isViewModeLoaded, loadViewMode_fn } from './_loadViewMode';
import { getSearchMisspellValue } from './_search';
import { getActiveElementByItems } from './_navigation';
import { processMarkedKey } from './marker';
import { saveState } from './_source';
import {
    Direction,
    IBaseSourceConfig,
    TSelectionCountMode,
    TSelectionViewMode,
} from 'Controls/interface';
import { IHasMoreStorage } from 'Controls/baseTree';

import {
    IStateBeforeShowSelected,
    TBASMiddlewarePrivateState,
    TMiddlewaresPropsForMigrationToDispatcher,
} from '../actions/beforeApplyState';
import { getStateForSelectionViewModeReset } from '../middlewares/selection';

import * as operationsPanelActions from '../actions/operationsPanel';
import * as selectionActions from '../actions/selection';
import * as basActions from '../actions/beforeApplyState';
import type { Collection as ICollection } from 'Controls/display';
import {
    withLogger,
    Logger as DispatcherLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';

const FIELDS_USED_IN_NEW_CODE = [
    'operationsPanelVisible',
    'markerVisibility',
    'markedKey',
    'multiSelectVisibility',
    'selectedKeys',
    'excludedKeys',
    'selectionViewMode',
    'showSelectedCount',
    'command',
] as const;

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'beforeApplyState',
    actionsNames: ['beforeApplyState', 'oldBeforeApplyState'],
});

export const beforeApplyState: TListMiddlewareCreator = (ctx) => {
    const { dispatch, getState, getCollection } = withLogger(ctx, 'beforeApplyState');

    return (next) => async (action: TListAction) => {
        logger.enter(action);

        switch (action.type) {
            case 'beforeApplyState': {
                const prevState = getCurrentStateSnapshot(getState());

                await dispatch(
                    operationsPanelActions.updateOperationsPanel(
                        prevState,
                        action.payload.nextState.operationsPanelVisible,
                        action.payload.nextState.multiSelectVisibility
                    )
                );

                await dispatch(
                    selectionActions.updateSelection(
                        prevState,
                        action.payload.nextState.selectedKeys,
                        action.payload.nextState.excludedKeys
                    )
                );

                await dispatch(
                    basActions.oldBeforeApplyState(
                        prevState,
                        action.payload.nextState,
                        action.payload._propsForMigration,
                        action.payload._middlewarePrivateState
                    )
                );

                break;
            }
            case 'oldBeforeApplyState': {
                // Старый код.
                // Мы уже что-то обновили выше.
                // В старый код нужно отдать предыдущий стейт, а в новый уже посчитанный.
                const nextState = await beforeApplyState_fn(
                    action.payload.prevState,
                    getCompatibleNextState(
                        action.payload.prevState,
                        action.payload.nextState,
                        getState()
                    ),
                    action.payload._propsForMigration,
                    action.payload._middlewarePrivateState,
                    getCollection(),
                    getState
                );
                await dispatch({
                    type: 'setState',
                    payload: {
                        state: nextState,
                    },
                });
                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};

const extract = (
    get: (
        fieldName: (typeof FIELDS_USED_IN_NEW_CODE)[number]
    ) => IListState[(typeof FIELDS_USED_IN_NEW_CODE)[number]]
): Pick<IListState, (typeof FIELDS_USED_IN_NEW_CODE)[number]> => {
    return FIELDS_USED_IN_NEW_CODE.reduce(
        (acc, fieldName) => ({ ...acc, [fieldName]: get(fieldName) }),
        {} as Pick<IListState, (typeof FIELDS_USED_IN_NEW_CODE)[number]>
    );
};

const getCurrentStateSnapshot = (state: IListState): IListState => {
    return { ...state, ...extract((fieldName) => state[fieldName]) };
};

const getCompatibleNextState = (
    prevState: IListState,
    nextState: IListState,
    nextStateWithTranslation: IListState
): IListState => {
    return {
        ...nextState,
        ...extract((fieldName) =>
            prevState[fieldName] !== nextStateWithTranslation[fieldName]
                ? nextStateWithTranslation[fieldName]
                : nextState[fieldName]
        ),
    };
};

async function beforeApplyState_fn(
    currentState: IListState,
    nextState: IListState,
    props: TMiddlewaresPropsForMigrationToDispatcher,
    privateState: TBASMiddlewarePrivateState,
    collection: ICollection,
    getState: (getStateStrategy?: 'inner' | 'original') => IListState
): Promise<IListState> {
    const needReloadBySelectionViewMode =
        (nextState.selectionViewMode === 'all' || nextState.selectionViewMode === 'hidden') &&
        currentState.selectionViewMode === 'selected';
    let viewModePromise: Promise<unknown> | undefined;
    let excludedKeysChanged = !isEqual(currentState.excludedKeys, nextState.excludedKeys);
    let selectedKeysChanged = !isEqual(currentState.selectedKeys, nextState.selectedKeys);

    const viewModeChanged = nextState.viewMode !== currentState.viewMode;
    // Для правильной работы expandedCompositeTree.
    if (nextState.viewMode === 'composite') {
        nextState.expandedItems = [null];
    }
    const collapsedItemsChanged = !isEqual(currentState.collapsedItems, nextState.collapsedItems);
    let expandedItemsChanged = !isEqual(currentState.expandedItems, nextState.expandedItems);
    const searchValueChanged = !isEqual(currentState.searchValue, nextState.searchValue);
    let filterChanged = !isEqual(currentState.filter, nextState.filter);
    const sourceControllerChanged = nextState.sourceController !== currentState.sourceController;
    const loadingPromises = [];
    const rootChanged = currentState.root !== nextState.root;
    const filterDescriptionChanged = !isEqual(
        currentState.filterDescription,
        nextState.filterDescription
    );

    if (currentState.countFilterValue !== nextState.countFilterValue) {
        nextState.filterDescription =
            AbstractListSlice.getFilterModuleSync().FilterDescription.applyFilterCounter(
                nextState.countFilterValue,
                nextState.filterDescription,
                nextState.countFilterLinkedNames,
                nextState.countFilterValueConverter
            );
    }

    if (filterDescriptionChanged || (filterChanged && nextState.filterDescription?.length)) {
        nextState.filter =
            AbstractListSlice.getFilterModuleSync().FilterCalculator.getFilterByFilterDescription(
                nextState.filter,
                nextState.filterDescription
            );
        filterChanged = true;
    }
    if (sourceControllerChanged) {
        props.sliceCallbacks.unsubscribeFromSourceController();
        props.sliceProperties.sourceController = nextState.sourceController;

        if (!nextState.sourceController) {
            nextState.sourceController = props.sliceCallbacks.getSourceController(
                getSourceControllerOptions(currentState)
            );
        } else {
            nextState.items = nextState.sourceController.getItems();
        }
    }

    // Если во время поиска поменяли фильтр, то надо сбросить корень перед поиском, т.к мы можем в него не вернуться
    if (
        (filterDescriptionChanged || filterChanged || rootChanged) &&
        privateState.rootBeforeSearch !== undefined
    ) {
        privateState.rootBeforeSearch = null;
    }
    if (rootChanged) {
        // FIXME: Types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        RootHistoryUtils.store(nextState.rootHistoryId, nextState.root);

        if (nextState.searchValue) {
            Object.assign(nextState, getStateOnSearchReset(nextState, privateState));

            if (nextState.searchNavigationMode === 'expand') {
                nextState.expandedItems = getSearchResolver().getExpandedItemsForRoot(
                    // FIXME: Types
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    nextState.root,
                    currentState.root,
                    nextState.items,
                    nextState.parentProperty
                );
                nextState.root = currentState.root;
                expandedItemsChanged = true;
            }
        }
    }
    if (currentState.items !== nextState.items) {
        props.sliceCallbacks.updateSubscriptionOnItems(currentState.items, nextState.items);
    }
    const isAllSelectedInCurrentRoot =
        currentState.selectedKeys?.includes(currentState.root) &&
        currentState.excludedKeys?.includes(currentState.root);
    const shouldResetSelection =
        isAllSelectedInCurrentRoot &&
        nextState.searchValue !== currentState.searchValue &&
        nextState.searchValue === '' &&
        currentState.root !== privateState.rootBeforeSearch;

    if (shouldResetSelection) {
        nextState.selectedKeys = [];
        nextState.excludedKeys = [];
        selectedKeysChanged = true;
        excludedKeysChanged = true;
    }
    if (
        (selectedKeysChanged ||
            excludedKeysChanged ||
            searchValueChanged ||
            expandedItemsChanged ||
            currentState.markedKey !== nextState.markedKey) &&
        currentState.listConfigStoreId
    ) {
        saveState(nextState);
    }

    const needReloadBySourceController = nextState.sourceController?.updateOptions(
        getSourceControllerOptions(nextState)
    );

    if (
        (needReloadBySourceController ||
            rootChanged ||
            searchValueChanged ||
            props.sliceProperties.newItems) &&
        !needReloadBySelectionViewMode &&
        nextState.selectionViewMode === 'selected'
    ) {
        Object.assign(nextState, getStateForSelectionViewModeReset());
    }
    const needReload =
        needReloadBySourceController ||
        needReloadBySelectionViewMode ||
        (nextState.searchNavigationMode === 'expand' && rootChanged);

    if (props.sliceProperties.newItems) {
        if (!needReload) {
            const newItems = props.sliceProperties.newItems;
            const sourceConfig = props.sliceProperties.loadConfig?.sourceConfig;
            const keepNavigation = props.sliceProperties.loadConfig?.keepNavigation;
            props.sliceProperties.newItems = null;
            props.sliceProperties.loadConfig = null;

            return dataLoadedInner({
                items: newItems,
                direction: undefined,
                nextState,
                additionalPromise: viewModePromise,
                key: undefined,
                currentState,
                privateState,
                props,
            }).then((newState) => {
                nextState.sourceController?.setItemsAfterLoad(
                    newItems,
                    sourceConfig,
                    keepNavigation
                );
                return {
                    ...nextState,
                    ...newState,
                    ...getStateAfterUpdateItems(currentState, newState),
                };
            });
        } else {
            props.sliceProperties.newItems = null;
        }
    }
    const countChanged = currentState.count !== nextState.count;

    if (
        nextState.selectionViewMode !== currentState.selectionViewMode &&
        nextState.selectionViewMode === 'selected'
    ) {
        privateState.stateBeforeShowSelected = getStateBeforeShowSelectedApply(nextState);
        Object.assign(nextState, getStateForOnlySelectedItems(nextState, privateState, props));
        nextState.sourceController?.setFilter(nextState.filter);
        props.sliceProperties.previousViewMode = null;
    }
    if (currentState.selectionViewMode === 'selected' && nextState.selectionViewMode === 'all') {
        privateState.stateBeforeShowSelected = null;
        nextState.isAllSelected = false;
        nextState.showSelectedCount = null;
        nextState.listCommandsSelection = getListCommandsSelection(nextState, privateState);
    }
    if (nextState.selectionViewMode === 'selected') {
        nextState.breadCrumbsItems = null;
        nextState.breadCrumbsItemsWithoutBackButton = null;
        nextState.backButtonCaption = '';
    }

    if (excludedKeysChanged) {
        nextState.operationsController?.setExcludedKeys(nextState.excludedKeys);
    }

    if (
        excludedKeysChanged ||
        selectedKeysChanged ||
        currentState.markedKey !== nextState.markedKey
    ) {
        nextState.listCommandsSelection = getListCommandsSelection(nextState, privateState);
    }

    if (countChanged || filterChanged) {
        if (typeof nextState.count === 'number' && !filterChanged) {
            const operationsController = nextState.operationsController;
            if (
                operationsController &&
                operationsController?.getCounterConfig()?.count !== nextState.count
            ) {
                operationsController.updateSelectedKeysCount(
                    nextState.count,
                    nextState.isAllSelected,
                    // FIXME: Types
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    nextState.listId
                );
            }
        } else if (
            nextState.selectedCountConfig &&
            (nextState.count === null || (filterChanged && nextState.selectedKeys.length))
        ) {
            const selection = {
                selected: nextState.selectedKeys,
                excluded: nextState.excludedKeys,
            };
            const countConfig = getCountConfig(nextState.selectedCountConfig, nextState.filter);
            nextState.countLoading = true;
            loadCount(
                selection,
                countConfig,
                nextState.selectionCountMode,
                nextState.recursiveSelection
            ).then((newCount) => {
                if (!props.sliceCallbacks.isDestroyed()) {
                    props.sliceCallbacks.setState({
                        count: newCount,
                        countLoading: false,
                    });
                }
            });
        } else if (countChanged) {
            nextState.operationsController?.updateSelectedKeysCount(
                nextState.count as unknown as number,
                nextState.isAllSelected,
                // FIXME: Types
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                nextState.listId
            );
        }
    }

    const searchViewMode = resolveSearchViewMode(
        // FIXME: Types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        currentState.adaptiveSearchMode,
        nextState.viewMode
    );
    if (nextState.viewMode !== searchViewMode) {
        props.sliceProperties.previousViewMode = nextState.viewMode;
    }

    // Поддержка смены viewMode в режиме поиска
    if (viewModeChanged && nextState.searchValue) {
        nextState.previousViewMode = nextState.viewMode;
        nextState.viewMode = searchViewMode;
    }

    if (expandedItemsChanged) {
        // FIXME: Types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        nextState.sourceController?.setExpandedItems(nextState.expandedItems);
        if (nextState.nodeHistoryId) {
            nextState.sourceController?.updateExpandedItemsInUserStorage();
        }
    } else if (needReload && !(nextState.sourceController?.isExpandAll() || nextState.deepReload)) {
        nextState.expandedItems = [];
        nextState.sourceController?.setExpandedItems([]);
    }

    if (searchValueChanged && nextState.searchParam) {
        if (nextState.searchValue) {
            props.sliceCallbacks.applyState({
                searchInputValue: nextState.searchInputValue,
            });
            const loadPromise = search(
                currentState,
                nextState,
                nextState.searchValue,
                privateState,
                props
            )
                .then(({ items, root, searchValue }) => {
                    const stateAfterSearch = {
                        ...nextState,
                        root,
                        searchValue,
                        searchInputValue: getState('original').searchInputValue,
                    };

                    return dataLoadedInner({
                        items,
                        direction: undefined,
                        nextState: stateAfterSearch,
                        additionalPromise: viewModePromise,
                        key: undefined,
                        props,
                        privateState,
                        currentState,
                    }).then((resultState) => {
                        resultState.sourceController?.updateOptions(
                            getSourceControllerOptions(resultState)
                        );
                        resultState.sourceController?.setItemsAfterLoad(items as RecordSet);
                        return {
                            ...resultState,
                            ...getStateAfterUpdateItems(currentState, resultState),
                        };
                    });
                })
                .catch((error: Error) => {
                    return getStateAfterLoadError(
                        currentState,
                        nextState,
                        error,
                        currentState.root
                    );
                });
            loadingPromises.push(loadPromise);
        } else {
            props.sliceCallbacks.applyState({
                loading: true,
                searchMisspellValue: '',
                searchInputValue: nextState.searchInputValue,
            });
            const loadingPromise = resetSearch(currentState, nextState, privateState, props)
                .then((newItems) => {
                    let root;

                    if (privateState.rootBeforeSearch !== undefined) {
                        root = privateState.rootBeforeSearch;
                        privateState.rootBeforeSearch = undefined;
                    } else {
                        root = nextState.root;
                    }

                    return dataLoadedInner({
                        items: newItems,
                        direction: undefined,
                        nextState: {
                            ...nextState,
                            root,
                            searchValue: '',
                            searchMisspellValue: '',
                            searchInputValue: getState('original').searchInputValue,
                        },
                        additionalPromise: viewModePromise,
                        key: undefined,
                        privateState,
                        props,
                        currentState,
                    }).then((newState) => {
                        newState.sourceController?.setItemsAfterLoad(newItems as RecordSet);
                        return {
                            ...newState,
                            ...getStateAfterUpdateItems(currentState, newState),
                            searchInputValue: getState('original').searchInputValue,
                        };
                    });
                })
                .catch((error) => {
                    return getStateAfterLoadError(
                        currentState,
                        nextState,
                        error,
                        currentState.root
                    );
                });
            loadingPromises.push(loadingPromise);
        }
    }

    if (viewModeChanged && !isViewModeLoaded(currentState, nextState.viewMode)) {
        viewModePromise = loadViewMode_fn(currentState, nextState.viewMode);
        loadingPromises.push(viewModePromise);
    }

    if (needReload && (!searchValueChanged || !nextState.searchParam)) {
        const stateForApply: Partial<IListState> = {
            loading: true,
        };
        if (filterDescriptionChanged) {
            stateForApply.filterDescription = nextState.filterDescription;
        }
        if (currentState.searchInputValue !== nextState.searchInputValue) {
            stateForApply.searchInputValue = nextState.searchInputValue;
        }
        props.sliceCallbacks.applyState(stateForApply);
        // При ммене рута props.sliceProperties.loadConfig хранит курсорную навигацию с изменённым position.
        // Нужно обновить курсорную навигацию в стейте и вызвыать reloadSourceController() с нужной конфигурацией.
        let navigationSourceConfig;
        if (rootChanged && props.sliceProperties.loadConfig?.sourceConfig) {
            // Обновляем только курсорную навигацию
            if (nextState.navigation?.source === 'position') {
                navigationSourceConfig = props.sliceProperties.loadConfig?.sourceConfig;
                nextState.navigation = {
                    ...nextState.navigation,
                    sourceConfig: navigationSourceConfig,
                };
            }
            props.sliceProperties.loadConfig = null;
        }
        const loadingPromise = reloadSourceController(
            nextState || currentState,
            navigationSourceConfig
        )
            .then((items) => {
                const newState = { ...nextState };
                return dataLoadedInner({
                    items,
                    direction: undefined,
                    nextState: newState,
                    additionalPromise: viewModePromise,
                    key: undefined,
                    currentState,
                    props,
                    privateState,
                }).then((dataLoadedResult) => {
                    nextState.sourceController?.setItemsAfterLoad(items as RecordSet);
                    const resultState = {
                        ...dataLoadedResult,
                        items: nextState.sourceController?.getItems(),
                        hasMoreStorage: getHasMoreStorage(nextState),
                    };
                    return {
                        ...resultState,
                        ...getStateAfterUpdateItems(currentState, resultState),
                    };
                });
            })
            .catch((error) => {
                return getStateAfterLoadError(currentState, nextState, error, nextState.root);
            });
        loadingPromises.push(loadingPromise);
    }

    if (
        collection &&
        !needReload &&
        !searchValueChanged &&
        (expandedItemsChanged || collapsedItemsChanged)
    ) {
        const expandedItemsDiff = ArrayUtil.getArrayDifference(
            currentState.expandedItems,
            nextState.expandedItems
        );

        if (expandedItemsDiff.added.length) {
            const nodeLoadersPromises = [];
            expandedItemsDiff.added.forEach((key: CrudEntityKey) => {
                if (
                    currentState.sourceController &&
                    !currentState.sourceController.hasLoaded(key)
                ) {
                    nodeLoadersPromises.push(
                        // TODO: Тип direction - темная магия помноженная на издевательство,
                        //  в разных местах передается void 0, undefined, null и string.
                        //  Причем null делает одно, void 0 и undefined другое, а string третье.
                        //  Не зная не поймешь, такого быть не должно.
                        //
                        props.sliceCallbacks.load(
                            nextState,
                            void 0,
                            key,
                            void 0,
                            void 0,
                            void 0,
                            true
                        )
                    );
                }
            });

            if (nodeLoadersPromises.length) {
                loadingPromises.push(
                    Promise.all(nodeLoadersPromises)
                        .then(() => {
                            return {
                                ...nextState,
                                hasMoreStorage: getHasMoreStorage(nextState),
                            };
                        })
                        .catch((error) => {
                            return getStateAfterLoadError(
                                currentState,
                                { ...nextState, expandedItems: currentState.expandedItems },
                                error
                            );
                        })
                );
            } else {
                nextState.hasMoreStorage = getHasMoreStorage(nextState);
            }
        }
    }

    if (!loadingPromises.length) {
        nextState.selectionViewMode = getSelectionViewMode(currentState, nextState);
    }

    if (loadingPromises.length) {
        // @ts-ignore
        return Promise.all(loadingPromises).then((results: Partial<T>[]) => {
            let state = nextState;
            results.forEach((loadStateResult) => {
                state = {
                    ...state,
                    ...loadStateResult,
                };
            });
            return state;
        });
    } else {
        return Promise.resolve(nextState);
    }
}

function search(
    currentState: IListState,
    nextState: IListState = currentState,
    value: string,
    privateState: TBASMiddlewarePrivateState,
    props: TMiddlewaresPropsForMigrationToDispatcher
): Promise<unknown> {
    return new Promise((resolve) => {
        resolveModuleWithCallback(
            'Controls/search',
            ({ FilterResolver }: typeof import('Controls/search')) => {
                let searchValue = value;
                if (currentState.searchValueTrim) {
                    searchValue = value && value.trim();
                }
                if (!currentState.searchValue) {
                    privateState.hasHierarchyFilterBeforeSearch = FilterResolver.hasHierarchyFilter(
                        nextState.filter
                    );
                    privateState.hasRootInFilterBeforeSearch = nextState.filter.hasOwnProperty(
                        currentState.parentProperty
                    );
                }
                const promises = [];
                const { sourceController, viewMode, parentProperty } = nextState;
                const searchViewMode = resolveSearchViewMode(
                    nextState.adaptiveSearchMode,
                    viewMode
                );
                const breadCrumbsItems =
                    privateState.stateBeforeShowSelected?.breadCrumbsItems ||
                    nextState.breadCrumbsItems;
                const rootForSearch = FilterResolver.getRootForSearch(
                    breadCrumbsItems,
                    nextState.root,
                    parentProperty,
                    nextState.searchStartingWith
                );
                if (viewMode !== searchViewMode) {
                    const currentRoot = props.sliceProperties.sourceController.getRoot();

                    if (currentRoot !== rootForSearch) {
                        privateState.rootBeforeSearch = currentRoot;
                    }
                    props.sliceProperties.previousViewMode = viewMode;
                }
                const filterForSearch = FilterResolver.getFilterForSearch(
                    {
                        filter: nextState.filter,
                        root: nextState.root,
                        deepReload: nextState.deepReload,
                        parentProperty: nextState.parentProperty,
                        searchParam: nextState.searchParam,
                        searchStartingWith: nextState.searchStartingWith,
                        breadCrumbsItems,
                        sourceController: nextState.sourceController,
                    },
                    searchValue,
                    privateState.rootBeforeSearch
                );
                if (!nextState.deepReload && !sourceController?.isExpandAll()) {
                    sourceController?.setExpandedItems([]);
                }
                promises.push(
                    props.sliceCallbacks.load(
                        nextState,
                        undefined,
                        rootForSearch,
                        filterForSearch,
                        false
                    )
                );

                if (!isViewModeLoaded(currentState, searchViewMode)) {
                    promises.push(loadViewMode_fn(currentState, searchViewMode));
                }
                resolve(
                    Promise.all(promises).then(([items]) => {
                        return {
                            items,
                            root: rootForSearch,
                            searchValue: FilterResolver.needChangeSearchValueToSwitchedString(items)
                                ? FilterResolver.getSwitcherStrFromData(items)
                                : searchValue,
                        };
                    })
                );
            }
        );
    });
}

function resetSearch(
    currentState: IListState,
    nextState: IListState,
    privateState: TBASMiddlewarePrivateState,
    props: TMiddlewaresPropsForMigrationToDispatcher
): Promise<TLoadResult> {
    return new Promise((resolve) => {
        resolveModuleWithCallback(
            'Controls/search',
            ({ FilterResolver }: typeof import('Controls/search')) => {
                const filter = FilterResolver.getResetSearchFilter(
                    nextState.filter,
                    // FIXME: Types
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    nextState.searchParam,
                    nextState.parentProperty,
                    !privateState.hasHierarchyFilterBeforeSearch,
                    !privateState.hasRootInFilterBeforeSearch
                );
                if (privateState.rootBeforeSearch !== undefined && currentState.parentProperty) {
                    props.sliceProperties.sourceController?.setRoot(privateState.rootBeforeSearch);
                }
                nextState.sourceController?.setFilter(filter);
                const sourceControllerOptions = getSourceControllerOptions(nextState);
                nextState.sourceController?.updateOptions({
                    ...sourceControllerOptions,
                    root: nextState.sourceController.getRoot(),
                    filter,
                });
                resolve(reloadSourceController(nextState || currentState));
            }
        );
    });
}

function reloadSourceController(
    state: IListState,
    navigationSourceConfig?: IBaseSourceConfig
): Promise<TLoadResult> {
    // FIXME: Types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return state.sourceController?.reload(navigationSourceConfig, undefined, false);
}

function getStateForOnlySelectedItems(
    state: IListState,
    privateState: TBASMiddlewarePrivateState,
    props: TMiddlewaresPropsForMigrationToDispatcher
): Partial<IListState> {
    const newState: Record<string, unknown> = {
        breadCrumbsItems: null,
        breadCrumbsItemsWithoutBackButton: null,
        backButtonCaption: '',
        filter: state.filter,
    };

    if (state.searchValue) {
        Object.assign(newState, getStateOnSearchReset(state, privateState));
        newState.viewMode = props.sliceProperties.previousViewMode;
        state.sourceController?.setFilter(newState.filter);
    }

    if (state.filterDescription) {
        const { FilterDescription, FilterCalculator } = AbstractListSlice.getFilterModuleSync();
        newState.filterDescription = FilterDescription.resetFilterDescription(
            state.filterDescription,
            true
        );
        newState.filter = FilterCalculator.getFilterByFilterDescription(
            newState.filter,
            newState.filterDescription
        );
        state.sourceController?.setFilter(newState.filter);
    }

    if (state.count) {
        state.showSelectedCount = state.count;
    }
    state.listCommandsSelection = getListCommandsSelection(state, privateState);

    return newState as Partial<IListState>;
}

function getListCommandsSelection(
    nextState: IListState,
    privateState: TBASMiddlewarePrivateState
): ISelection {
    if (isLoaded('Controls/operations')) {
        return AbstractListSlice.getOperationsModuleSync().getListCommandsSelection(
            nextState,
            nextState.markedKey,
            privateState.stateBeforeShowSelected
        );
    }
}

function getStateOnSearchReset(
    state: IListState,
    privateState: TBASMiddlewarePrivateState
): Partial<IListState> {
    return {
        filter: getSearchResolver().getResetSearchFilter(
            state.filter,
            state.searchParam,
            state.parentProperty,
            !privateState.hasHierarchyFilterBeforeSearch,
            !privateState.hasRootInFilterBeforeSearch
        ),
        searchValue: '',
        searchInputValue: '',
        searchMisspellValue: '',
    } as Partial<IListState>;
}

function getStateBeforeShowSelectedApply({
    breadCrumbsItems,
    selectedKeys,
    excludedKeys,
}: IListState): IStateBeforeShowSelected {
    return {
        breadCrumbsItems,
        selected: selectedKeys,
        excluded: excludedKeys,
    };
}

type TDataLoadedInnerParams = {
    items: TLoadResult;
    direction: Direction | undefined;
    currentState: IListState;
    nextState: IListState;
    additionalPromise?: Promise<unknown>;
    key?: TKey;
    props: TMiddlewaresPropsForMigrationToDispatcher;
    privateState: TBASMiddlewarePrivateState;
};

export async function dataLoadedInner({
    items,
    direction,
    currentState,
    nextState,
    additionalPromise,
    key,
    props,
    privateState,
}: TDataLoadedInnerParams): Promise<Partial<IListState>> {
    const loadedPromises = [];

    const isNodeLoaded = key !== undefined && key !== nextState.root;
    let dataLoadResult;

    if (isNodeLoaded) {
        dataLoadResult = props.dataCallbacks.nodeDataLoaded(
            items as RecordSet,
            key,
            direction,
            nextState
        );
    } else {
        dataLoadResult = props.dataCallbacks.dataLoaded(items as RecordSet, direction, nextState);
    }

    if (isNodeLoaded && !direction) {
        nextState.hasMoreStorage = getHasMoreStorage(nextState);
    }

    if (dataLoadResult === undefined) {
        throw new Error(
            'Controls/dataFactory:ListSlice метод _dataLoaded не вернул новое состояние'
        );
    }

    if (dataLoadResult instanceof Promise) {
        loadedPromises.push(dataLoadResult);
    } else {
        loadedPromises.push(Promise.resolve(dataLoadResult));
    }
    if (additionalPromise) {
        loadedPromises.push(additionalPromise);
    }
    return Promise.all(loadedPromises).then(([dataLoadResult]) => {
        return {
            ...dataLoadResult,
            ...getLoadResult({
                currentState,
                nextState: dataLoadResult,
                items,
                privateState,
                props,
            }),
        };
    });
}

type TGetLoadResultParams = {
    currentState: IListState;
    nextState: IListState;
    items: RecordSet;
    privateState: TBASMiddlewarePrivateState;
    props: TMiddlewaresPropsForMigrationToDispatcher;
};

function getLoadResult({
    currentState,
    nextState,
    items,
    props,
    privateState,
}: TGetLoadResultParams): Partial<IListState> {
    const sourceController = nextState.sourceController;
    const searchViewMode = resolveSearchViewMode(
        currentState.adaptiveSearchMode,
        props.sliceProperties.previousViewMode
    );
    const rootChanged = nextState.root !== currentState.root;
    const searchValue = nextState.searchValue;
    const searchParam = nextState.searchParam;
    const searchValueChanged = searchValue !== currentState.searchValue;
    const expandedItemsChanged = !isEqual(nextState.expandedItems, currentState.expandedItems);
    const hasSearch = !!searchParam && searchValue;
    let viewMode;

    if (hasSearch) {
        viewMode = searchViewMode;
    } else if (searchParam) {
        viewMode = props.sliceProperties.previousViewMode;
    } else {
        viewMode = nextState.viewMode;
    }

    sourceController?.setRoot(nextState.root);
    if (hasSearch) {
        sourceController?.setFilter(nextState.filter);
    }

    if (expandedItemsChanged) {
        sourceController?.setExpandedItems(nextState.expandedItems);
    }
    const sourceControllerState = sourceController.getState();
    let newRoot = sourceControllerState.root;
    let stateAfterUpdateItems = getStateAfterUpdateItems(currentState, nextState);
    if (newRoot !== currentState.root) {
        const breadCrumbs = calculateBreadcrumbsData(items, nextState.displayProperty);
        stateAfterUpdateItems = {
            ...stateAfterUpdateItems,
            ...breadCrumbs,
        };
    }

    const markedState: IMarkerState = {};

    if (!props.sliceProperties.aspectStateManagers.has(AspectsNames.Root)) {
        markedState.markedKey = processMarkedKey(currentState, nextState);
    }

    if (
        nextState.searchStartingWith === 'root' &&
        searchParam &&
        searchValueChanged &&
        !searchValue &&
        nextState.parentProperty
    ) {
        newRoot = getSearchResolver().getRootForSearch(
            sourceControllerState.breadCrumbsItems,
            nextState.root,
            nextState.parentProperty,
            nextState.searchStartingWith
        );
    }

    if (searchParam) {
        let newFilter = sourceController.getFilter();
        if (searchValue) {
            newFilter = getSearchResolver().getFilterForSearch(
                nextState,
                nextState.searchValue,
                privateState.rootBeforeSearch
            );
        } else if (currentState.searchParam) {
            newFilter = getSearchResolver().getResetSearchFilter(
                nextState.filter,
                nextState.searchParam,
                nextState.parentProperty,
                !privateState.hasHierarchyFilterBeforeSearch,
                !privateState.hasRootInFilterBeforeSearch
            );
        }
        sourceController?.setFilter(newFilter);
    }

    return {
        loading: false,
        items: sourceControllerState.items,
        ...stateAfterUpdateItems,
        filter: sourceController.getFilter(),
        ...markedState,
        root: newRoot,
        sorting: sourceControllerState.sorting,
        viewMode,
        previousViewMode: props.sliceProperties.previousViewMode,
        errorViewConfig: undefined,
        expandedItems: sourceController?.getExpandedItems(),
        selectionViewMode: getSelectionViewMode(currentState, nextState),
        searchMisspellValue: hasSearch
            ? getSearchMisspellValue(items || props.sliceProperties.sourceController?.getItems())
            : '',
    } as Partial<IListState>;
}

// Делает вычисления активного элемента после того,
// как данные загружены и установлены в state
function calcActiveElementAfterUpdateItems(currentState: IListState, nextState: IListState) {
    let activeElement = nextState.activeElement;
    const rootChanged = nextState.root !== currentState.root;
    if (rootChanged) {
        if (
            nextState.root !== null &&
            (!currentState.breadCrumbsItems?.length ||
                !hasItemInArray(currentState.breadCrumbsItems, nextState.root))
        ) {
            // При переходе в папку активной должна становиться первая запись.
            activeElement = nextState.items ? getActiveElementByItems(nextState.items) : undefined;
        } else {
            // При переходе назад активным должен становиться предыдущий корень.
            activeElement = currentState.root;
        }
    }
    return activeElement;
}

function getStateAfterUpdateItems(currentState: IListState, nextState: IListState = currentState) {
    const sourceControllerState = nextState.sourceController.getState();
    return {
        selectionViewMode: getSelectionViewMode(currentState, nextState),
        items: sourceControllerState.items,
        activeElement: calcActiveElementAfterUpdateItems(currentState, nextState),
        breadCrumbsItems: sourceControllerState.breadCrumbsItems,
        breadCrumbsItemsWithoutBackButton: sourceControllerState.breadCrumbsItemsWithoutBackButton,
        backButtonCaption: sourceControllerState.backButtonCaption,
    };
}

function getSelectionViewMode(currentState: IListState, nextState: IListState): TSelectionViewMode {
    let selectionViewMode = nextState.selectionViewMode;
    const needCalcSelectionViewMode =
        !isEqual(currentState.selectedKeys, nextState.selectedKeys) ||
        !isEqual(currentState.excludedKeys, nextState.excludedKeys) ||
        currentState.searchValue !== nextState.searchValue ||
        currentState.root !== nextState.root ||
        !isEqual(currentState.expandedItems, nextState.expandedItems);

    if (needCalcSelectionViewMode && isLoaded('Controls/operations')) {
        selectionViewMode = AbstractListSlice.getOperationsModuleSync().getSelectionViewMode(
            selectionViewMode,
            nextState
        );
    }

    return selectionViewMode;
}

function loadCount(
    selection: ISelection,
    countConfig: ICountConfig,
    selectionCountMode: TSelectionCountMode = 'all',
    recursive?: boolean
): Promise<number | null | void> {
    return loadAsync<typeof import('Controls/operations')>('Controls/operations').then(
        ({ getCount }) => {
            return getCount
                .getCount(selection, countConfig, selectionCountMode, recursive)
                .then((newCount) => {
                    return newCount;
                });
        }
    );
}

function getHasMoreStorage(nextState: IListState): IHasMoreStorage {
    return (nextState.expandedItems || []).reduce<IHasMoreStorage>((result, key: CrudEntityKey) => {
        result[key] = {
            forward: nextState.sourceController?.hasMoreData('down', key),
            backward: nextState.sourceController?.hasMoreData('up', key),
        };
        return result;
    }, {});
}

function getCountConfig(selectedCountConfig: ICountConfig, filter: TFilter): ICountConfig {
    const data = selectedCountConfig.data || {};
    const selectedFilter = data.filter ? { ...filter, ...data.filter } : filter;
    return {
        ...selectedCountConfig,
        data: {
            filter: {
                ...selectedFilter,
            },
        },
    };
}

interface ICountConfig {
    rpc: Rpc;
    command: string;
    data: {
        filter?: object;
    };
}
