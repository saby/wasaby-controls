import { TListAction } from '../types/TListAction';
import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { isEqual } from 'Types/object';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import { RecordSet } from 'Types/collection';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { IListState } from '../../interface/IListState';
import { getSearchResolver } from '../../AbstractList/utils/getSearchResolver';
import { resolveSearchViewMode } from '../../List/utils';
import getStateAfterLoadError from '../../List/resources/error';
import type { Collection as ICollection } from 'Controls/display';

import {
    getListCommandsSelection,
    getSelectionViewMode,
    getStateForSelectionViewModeReset,
    getCountConfig,
    loadCount,
    getStateForOnlySelectedItems,
} from './operationsPanel';
import { getStateAfterUpdateItems, reloadFromBAS, dataLoadedInner, loadNodes } from './source';
import { getSourceControllerOptions } from './_loadData';
import { isViewModeLoaded, loadViewMode_fn } from './_loadViewMode';
import { saveState } from './_source';
import { search, resetSearch, getStateOnSearchReset } from './_search';

import { TMiddlewaresPropsForMigrationToDispatcher } from '../actions/beforeApplyState';
import * as basActions from '../actions/beforeApplyState';
import * as operationsPanelActions from '../actions/operationsPanel';
import * as selectionActions from '../actions/selection';
import * as markerActions from '../actions/marker';
import * as searchActions from '../actions/search';
import * as filterActions from '../actions/filter';
import * as rootActions from '../actions/root';
import * as sourceActions from '../actions/source';
import * as stateActions from '../actions/state';

import type { ISnapshotsStore } from '../types/ISnapshotsStore';

import {
    Logger as DispatcherLogger,
    withLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';
import { SnapshotName } from '../types/SnapshotName';

// Удалится вместе с остальной обвязкой перехода после удаления функции beforeApplyState_fn
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
    'searchValue',
    'listCommandsSelection',
    'filter',
    'filterDescription',
    'root',
    'searchValue',
    'loading',
    'promiseResolverForReloadOnly',
] as const;

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'beforeApplyState',
    actionsNames: ['beforeApplyState', 'oldBeforeApplyState'],
});

export const beforeApplyState: TListMiddlewareCreator = (ctx) => {
    const { dispatch, getState, getCollection, snapshots } = withLogger(ctx, 'beforeApplyState');

    return (next) => async (action: TListAction) => {
        logger.enter(action);

        switch (action.type) {
            case 'beforeApplyState': {
                const prevState = getCurrentStateSnapshot(getState());
                snapshots.set(SnapshotName.BeforeComplexUpdate, {
                    isComplexUpdate: true,
                });

                if (action.payload.actionsToDispatch) {
                    for (const _action of action.payload.actionsToDispatch.values()) {
                        await dispatch(_action);
                    }
                }

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
                    markerActions.complexUpdateMarker(prevState, action.payload.nextState)
                );

                await dispatch(
                    searchActions.updateSearch(prevState, action.payload.nextState.searchValue)
                );

                await dispatch(
                    filterActions.updateFilter(prevState, {
                        filter: action.payload.nextState.filter,
                        filterDescription: action.payload.nextState.filterDescription,
                        countFilterValue: action.payload.nextState.countFilterValue,
                        countFilterLinkedNames: action.payload.nextState.countFilterLinkedNames,
                        countFilterValueConverter:
                            action.payload.nextState.countFilterValueConverter,
                    })
                );

                await dispatch(
                    rootActions.complexUpdateRoot(prevState, action.payload.nextState.root)
                );

                await dispatch(
                    sourceActions.complexUpdateSource(prevState, action.payload.nextState)
                );

                await dispatch(
                    basActions.oldBeforeApplyState(
                        prevState,
                        action.payload.nextState,
                        action.payload._propsForMigration
                    )
                );

                await dispatch(sourceActions.awaitAllRequests());

                snapshots.delete(SnapshotName.BeforeComplexUpdate);
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
                    getCollection(),
                    snapshots,
                    getState,
                    dispatch
                );
                await dispatch(stateActions.setState(nextState));
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
    collection: ICollection,
    snapshots: ISnapshotsStore,
    getState: (getStateStrategy?: 'inner' | 'original') => IListState,
    dispatch: Function
): Promise<IListState> {
    const needReloadBySelectionViewMode =
        (nextState.selectionViewMode === 'all' || nextState.selectionViewMode === 'hidden') &&
        currentState.selectionViewMode === 'selected';
    let viewModePromise: Promise<unknown> | undefined;

    const viewModeChanged = nextState.viewMode !== currentState.viewMode;
    // Для правильной работы expandedCompositeTree.
    if (nextState.viewMode === 'composite') {
        nextState.expandedItems = [null];
    }
    const collapsedItemsChanged = !isEqual(currentState.collapsedItems, nextState.collapsedItems);
    let expandedItemsChanged = !isEqual(currentState.expandedItems, nextState.expandedItems);
    const searchValueChanged = !isEqual(currentState.searchValue, nextState.searchValue);
    const sourceControllerChanged = nextState.sourceController !== currentState.sourceController;
    const loadingPromises = [];
    const rootChanged = currentState.root !== nextState.root;

    const filterChanged = !isEqual(currentState.filter, nextState.filter);
    const filterDescriptionChanged = !isEqual(
        currentState.filterDescription,
        nextState.filterDescription
    );

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

    if (rootChanged) {
        // FIXME: Types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        RootHistoryUtils.store(nextState.rootHistoryId, nextState.root);

        if (nextState.searchValue) {
            Object.assign(nextState, getStateOnSearchReset(nextState, snapshots));

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

    if (expandedItemsChanged && currentState.listConfigStoreId) {
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

    if (needReload) {
        snapshots.set(SnapshotName.BeforeComplexUpdate, {
            ...(snapshots.get(SnapshotName.BeforeComplexUpdate) || {}),
            _needReloadBySourceController: needReload,
        });
    }

    if (props.sliceProperties.newItems) {
        if (!needReload) {
            const newItems = props.sliceProperties.newItems;
            const direction = props.sliceProperties.newItemsDirection;
            const sourceConfig = props.sliceProperties.loadConfig?.sourceConfig;
            const keepNavigation = props.sliceProperties.loadConfig?.keepNavigation;
            props.sliceProperties.newItems = null;
            props.sliceProperties.loadConfig = null;
            props.sliceProperties.newItemsDirection = undefined;

            return dataLoadedInner({
                items: newItems,
                direction,
                nextState,
                additionalPromise: viewModePromise,
                key: undefined,
                currentState,
                props,
                snapshots,
            }).then((newState) => {
                nextState.sourceController?.setItemsAfterLoad(
                    newItems,
                    sourceConfig,
                    keepNavigation,
                    direction
                );

                if (nextState._loadItemsToDirectionPromiseResolver) {
                    nextState._loadItemsToDirectionPromiseResolver();
                    delete nextState._loadItemsToDirectionPromiseResolver;
                }

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
        snapshots.set(SnapshotName.BeforeShowOnlySelected, {
            breadCrumbsItems: nextState.breadCrumbsItems,
            selected: nextState.selectedKeys,
            excluded: nextState.excludedKeys,
        });
        Object.assign(nextState, getStateForOnlySelectedItems(nextState, props, snapshots));
        nextState.sourceController?.setFilter(nextState.filter);
        props.sliceProperties.previousViewMode = null;
    }
    if (currentState.selectionViewMode === 'selected' && nextState.selectionViewMode === 'all') {
        snapshots.delete(SnapshotName.BeforeShowOnlySelected);
        nextState.isAllSelected = false;
        nextState.showSelectedCount = null;
        nextState.listCommandsSelection = getListCommandsSelection(nextState, snapshots);
    }
    if (nextState.selectionViewMode === 'selected') {
        nextState.breadCrumbsItems = null;
        nextState.breadCrumbsItemsWithoutBackButton = null;
        nextState.backButtonCaption = '';
    }

    if (
        countChanged ||
        filterChanged ||
        (nextState.selectedCountConfig &&
            nextState.count === null &&
            (selectedKeysChanged || excludedKeysChanged))
    ) {
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
                props,
                snapshots
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
                        currentState,
                        snapshots,
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
                    return getStateAfterLoadError(currentState, nextState, error, {
                        root: currentState.root,
                    });
                });
            loadingPromises.push(loadPromise);
        } else {
            props.sliceCallbacks.applyState({
                loading: true,
                searchMisspellValue: '',
                searchInputValue: nextState.searchInputValue,
            });
            const loadingPromise = resetSearch(currentState, nextState, props, snapshots)
                .then((newItems) => {
                    let root;

                    const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);
                    // TODO: Убрать проверку на undefined. Это костыль.
                    if (beforeSearchSnapshot && beforeSearchSnapshot.root !== undefined) {
                        root = beforeSearchSnapshot.root;
                        snapshots.delete(SnapshotName.BeforeSearch);
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
                        props,
                        currentState,
                        snapshots,
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
                    return getStateAfterLoadError(currentState, nextState, error, {
                        root: currentState.root,
                    });
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

        dispatch(sourceActions.load());
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
            loadingPromises.push(
                loadNodes({
                    currentState,
                    nextState,
                    keys: expandedItemsDiff.added,
                    props,
                })
            );
        }
    }

    if (!loadingPromises.length) {
        nextState.selectionViewMode = getSelectionViewMode(currentState, nextState);
    }

    if (loadingPromises.length) {
        // @ts-ignore
        return Promise.all(loadingPromises).then((results: Partial<T>[]) =>
            results.reduce((state, loadStateResult) => {
                return {
                    ...state,
                    ...loadStateResult,
                };
            }, nextState)
        );
    } else {
        return Promise.resolve(nextState);
    }
}
