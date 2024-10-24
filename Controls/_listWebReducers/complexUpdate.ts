/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isEqual } from 'Types/object';
import { RootHistoryUtils } from 'Controls/Utils/RootHistoryUtils';
import { RecordSet } from 'Types/collection';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type { Collection as ICollection } from 'Controls/display';
import { SnapshotName } from 'Controls-DataEnv/list';

import { TListActions, ListActionCreators, TListMiddleware } from 'Controls-DataEnv/list';

import {
    ListWebInitializers,
    IListState,
    _private,
    getDecomposedPromise,
} from 'Controls/dataFactory';

const {
    resolveSearchViewMode,
    getListCommandsSelection,
    getCountConfig,
    loadCount,
    getStateAfterLoadError,
    getStateForOnlySelectedItems,
    getStateOnSearchReset,
    search,
    resetSearch,
    isViewModeLoaded,
    loadViewModeFn,
    getSelectionViewMode,
} = _private;

export const complexUpdate: TListMiddleware =
    ({ dispatch, getState, setState, getCollection, snapshots, originalSliceGetState }) =>
    (next) =>
    async (action) => {
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
                    ListActionCreators.operationsPanel.complexUpdateOperationsPanel(
                        prevState,
                        action.payload.nextState
                    )
                );

                await dispatch(
                    ListActionCreators.selection.updateSelection(
                        prevState,
                        action.payload.nextState.selectedKeys,
                        action.payload.nextState.excludedKeys
                    )
                );

                await dispatch(
                    ListActionCreators.items.complexUpdateItems(prevState, action.payload.nextState)
                );

                await dispatch(
                    ListActionCreators.marker.complexUpdateMarker(
                        prevState,
                        action.payload.nextState
                    )
                );

                await dispatch(
                    ListActionCreators.search.updateSearch(
                        prevState,
                        action.payload.nextState.searchValue
                    )
                );

                await dispatch(
                    ListActionCreators.filter.updateFilter(prevState, {
                        filter: action.payload.nextState.filter,
                        filterDescription: action.payload.nextState.filterDescription,
                        countFilterValue: action.payload.nextState.countFilterValue,
                        countFilterLinkedNames: action.payload.nextState.countFilterLinkedNames,
                        countFilterValueConverter:
                            action.payload.nextState.countFilterValueConverter,
                    })
                );

                await dispatch(
                    ListActionCreators.root.complexUpdateRoot(
                        prevState,
                        action.payload.nextState.root
                    )
                );

                await dispatch(
                    ListActionCreators.source.complexUpdateSource(
                        prevState,
                        action.payload.nextState
                    )
                );

                await dispatch(
                    ListActionCreators.complexUpdate.oldBeforeApplyState(
                        prevState,
                        action.payload.nextState,
                        action.payload._propsForMigration
                    )
                );

                await dispatch(ListActionCreators.source.awaitAllRequests());

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
                    (s) => (s === 'original' ? originalSliceGetState() : getState()),
                    dispatch
                );
                setState(nextState);
                break;
            }
        }

        next(action);
    };

type ISnapshotsStore = Parameters<TListMiddleware>[0]['snapshots'];

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
    '_loadItemsToDirectionPromiseResolver',
] as const;

const extractNewState = (
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
    return { ...state, ...extractNewState((fieldName) => state[fieldName]) };
};

const getUserState = (
    prevState: IListState,
    nextState: IListState,
    nextStateWithTranslation: IListState
) => {
    const keys: string[] = Array.from(
        new Set([...Object.keys(prevState), ...Object.keys(nextState)])
    );

    const userChangedKeysInDataCallbacks = keys.filter(
        (key) =>
            FIELDS_USED_IN_NEW_CODE.indexOf(key) === -1 &&
            prevState[key] === nextState[key] &&
            nextState[key] !== nextStateWithTranslation[key]
    );

    return userChangedKeysInDataCallbacks.reduce((acc, key) => {
        return {
            ...acc,
            [key]: nextStateWithTranslation[key],
        };
    }, {});
};

const getCompatibleNextState = (
    prevState: IListState,
    nextState: IListState,
    nextStateWithTranslation: IListState
): IListState => {
    return {
        ...nextState,
        ...extractNewState((fieldName) =>
            prevState[fieldName] !== nextStateWithTranslation[fieldName]
                ? nextStateWithTranslation[fieldName]
                : nextState[fieldName]
        ),
        // Костыль пока существует старый код _beforeApplyState.
        // Мы должны переложить в nextState для старого кода те поля, которые
        // изменились в dataLoaded и nodeDataLoaded.
        // Это поля, которые одинаковые на prev и next state, но отличаются от
        // внутреннего состояния диспатчера.
        // При этом это не должны быть поля, задекларированные
        // в новом коде (FIELDS_USED_IN_NEW_CODE).
        ...getUserState(prevState, nextState, nextStateWithTranslation),
    };
};

async function beforeApplyState_fn(
    currentState: IListState,
    nextState: IListState,
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher,
    collection: ICollection,
    snapshots: ISnapshotsStore,
    getState: (getStateStrategy?: 'inner' | 'original') => IListState,
    dispatch: Function
): Promise<IListState> {
    const needReloadBySelectionViewMode =
        (nextState.selectionViewMode === 'all' || nextState.selectionViewMode === 'hidden') &&
        currentState.selectionViewMode === 'selected';
    let viewModePromise: Promise<unknown> | undefined;
    const excludedKeysChanged = !isEqual(currentState.excludedKeys, nextState.excludedKeys);
    const selectedKeysChanged = !isEqual(currentState.selectedKeys, nextState.selectedKeys);

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
        // Нам не нужно отписываться от старого сорс контроллера, т.к.
        // в момент выполнения Dispatcher.dispatch мы отписаны от контроллера источника.
        // Это обеспечивает сейчас слайс.

        if (!nextState.sourceController) {
            nextState.sourceController =
                ListWebInitializers.source.createSourceController(currentState);
        } else {
            nextState.items = nextState.sourceController.getItems();
        }

        props.sliceProperties.sourceController = nextState.sourceController;
    }

    if (rootChanged) {
        // FIXME: Types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        RootHistoryUtils.store(nextState.rootHistoryId, nextState.root);

        if (nextState.searchValue) {
            Object.assign(nextState, getStateOnSearchReset(nextState, snapshots));

            if (nextState.searchNavigationMode === 'expand') {
                nextState.expandedItems = loadSync<typeof import('Controls/search')>(
                    'Controls/search'
                ).FilterResolver.getExpandedItemsForRoot(
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
        await dispatch(
            ListActionCreators.source.setSavedSourceState(currentState.listConfigStoreId, nextState)
        );
    }

    const needReloadBySourceController = nextState.sourceController?.updateOptions(
        // TODO: source -> complexUpdate
        ListWebInitializers.source.getSourceControllerOptions(nextState)
    );

    if (
        (needReloadBySourceController ||
            rootChanged ||
            searchValueChanged ||
            props.sliceProperties.newItems) &&
        !needReloadBySelectionViewMode &&
        nextState.selectionViewMode === 'selected'
    ) {
        Object.assign(nextState, { selectionViewMode: 'hidden', showSelectedCount: null });
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

            const dNewItemsReceived = getDecomposedPromise<Partial<IListState>>();

            return dispatch(
                ListActionCreators.source.newItemsReceived({
                    items: newItems as RecordSet,
                    itemsDirection: direction,
                    currentState,
                    nextState,
                    loadConfig: {
                        sourceConfig,
                        keepNavigation,
                    },
                    additionalPromise: viewModePromise,

                    onResolve: dNewItemsReceived.resolve,
                    onReject: dNewItemsReceived.reject,
                })
            ).then(() => dNewItemsReceived.promise);
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
    } else if (
        excludedKeysChanged ||
        selectedKeysChanged ||
        nextState.listCommandsSelection !== nextState.markedKey
    ) {
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
                snapshots,
                dispatch
            )
                .then(({ items, root, searchValue }) => {
                    const stateAfterSearch = {
                        ...nextState,
                        root,
                        searchValue,
                        searchInputValue: getState('original').searchInputValue,
                    };

                    const dLoadedSuccess = getDecomposedPromise<Partial<IListState>>();

                    return dispatch(
                        ListActionCreators.source.dataLoadedSuccess({
                            items,
                            nextState: stateAfterSearch,
                            additionalPromise: viewModePromise,
                            currentState,
                            onResolve: dLoadedSuccess.resolve,
                            onReject: dLoadedSuccess.reject,
                        })
                    )
                        .then(() => dLoadedSuccess.promise)
                        .then(async (resultState: IListState) => {
                            resultState.sourceController?.updateOptions(
                                // TODO: source -> complexUpdate
                                ListWebInitializers.source.getSourceControllerOptions(resultState)
                            );
                            resultState.sourceController?.setItemsAfterLoad(items as RecordSet);

                            const stateAfterUpdateItems = {
                                current: {},
                            };

                            await dispatch(
                                ListActionCreators.source.resolveStateAfterUpdateItems({
                                    currentState,
                                    nextState: resultState,
                                    resultRef: stateAfterUpdateItems,
                                })
                            );

                            return {
                                ...resultState,
                                ...stateAfterUpdateItems.current,
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
            const loadingPromise = resetSearch(currentState, nextState, props, snapshots, dispatch)
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

                    const dLoadedSuccess = getDecomposedPromise<Partial<IListState>>();

                    return dispatch(
                        ListActionCreators.source.dataLoadedSuccess({
                            items: newItems as RecordSet,
                            nextState: {
                                ...nextState,
                                root,
                                searchValue: '',
                                searchMisspellValue: '',
                                searchInputValue: getState('original').searchInputValue,
                            },
                            additionalPromise: viewModePromise,
                            currentState,

                            onResolve: dLoadedSuccess.resolve,
                            onReject: dLoadedSuccess.reject,
                        })
                    )
                        .then(() => dLoadedSuccess.promise)
                        .then(async (newState: IListState) => {
                            newState.sourceController?.setItemsAfterLoad(newItems as RecordSet);

                            const stateAfterUpdateItems = {
                                current: {},
                            };

                            await dispatch(
                                ListActionCreators.source.resolveStateAfterUpdateItems({
                                    currentState,
                                    nextState: newState,
                                    resultRef: stateAfterUpdateItems,
                                })
                            );

                            return {
                                ...newState,
                                ...stateAfterUpdateItems.current,
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
        viewModePromise = loadViewModeFn(currentState, nextState.viewMode);
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
        // При смене рута props.sliceProperties.loadConfig хранит курсорную навигацию с изменённым position.
        // Нужно обновить курсорную навигацию в стейте и вызывать reloadSourceController() с нужной конфигурацией.
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

        dispatch(ListActionCreators.source.load(navigationSourceConfig));
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

        if (expandedItemsDiff.added.length && nextState.source) {
            const dPromise = getDecomposedPromise<IListState>();

            await dispatch(
                ListActionCreators.source.loadNodes({
                    currentState,
                    nextState,
                    keys: expandedItemsDiff.added,
                    onResolve: dPromise.resolve,
                })
            );

            loadingPromises.push(dPromise.promise);
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
