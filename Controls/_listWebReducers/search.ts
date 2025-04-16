/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    getDecomposedPromise,
    IListState,
    ListWebActions,
    ListWebInitializers,
    TListMiddleware,
} from 'Controls/dataFactory';
import {
    _privateForOldCode_ISnapshotsStore as ISnapshotsStore,
    ListActionCreators,
    SnapshotName,
    TListActions,
} from 'Controls-DataEnv/list';

import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { RecordSet } from 'Types/collection';
import { Initializer } from 'Controls-DataEnv/abstractList';
import { resolveSearchViewMode, getStateAfterLoadError } from './utils';

export const search: TListMiddleware =
    ({
        getState,
        setState,
        dispatch,
        snapshots,
        getTrashBox,
        originalSliceGetState,
        applyState,
        registerPendingPromise,
        scheduleDispatch,
    }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'resetSearch': {
                //# region Обновление маркера
                setState({
                    searchValue: '',
                });
                //# endregion

                //# region Сайд-эффекты

                const state = getState();
                const hasMoreInRoot = state.hasMoreStorage[state.root];
                if (
                    Initializer.selection
                        .getSelectionStrategy(getState())
                        .isAllSelected(
                            state,
                            hasMoreInRoot && (hasMoreInRoot.backward || hasMoreInRoot.forward),
                            state.count,
                            0,
                            false
                        )
                ) {
                    await dispatch(ListWebActions.selection.resetSelection());
                }

                //# endregion Сайд-эффекты
                break;
            }
            case 'awaitAllRequests': {
                const searchValue = getState().searchValue;
                const searchValueChanged = originalSliceGetState().searchValue !== searchValue;
                if (searchValueChanged) {
                    let newState;
                    try {
                        if (searchValue) {
                            newState = await registerPendingPromise(
                                'awaitAllRequests',
                                oldSearch(
                                    getTrashBox()._propsForMigrationToDispatcher,
                                    originalSliceGetState(),
                                    getState(),
                                    snapshots,
                                    dispatch,
                                    getState,
                                    applyState,
                                    originalSliceGetState,
                                    registerPendingPromise
                                )
                            );
                        } else if (originalSliceGetState().root === getState().root) {
                            newState = await registerPendingPromise(
                                'awaitAllRequests',
                                oldResetSearch(
                                    getTrashBox()._propsForMigrationToDispatcher,
                                    originalSliceGetState(),
                                    getState(),
                                    snapshots,
                                    dispatch,
                                    getState,
                                    applyState,
                                    originalSliceGetState,
                                    registerPendingPromise
                                )
                            );
                        }
                        if (newState) {
                            setState(newState);
                        }
                    } catch (error) {
                        setState(
                            getStateAfterLoadError(originalSliceGetState(), getState(), error, {
                                root: originalSliceGetState().root,
                            }) as Partial<IListState>
                        );
                        break;
                    }
                    const previousMarkedKey = getState().markedKey;
                    const collection = getState().collection;
                    if (getState().fix88221034303402 && previousMarkedKey && collection) {
                        scheduleDispatch(
                            ListWebActions.marker.markNearbyItem(-1, previousMarkedKey)
                        );
                    }
                }
            }
        }

        next(action);
    };

async function getFilterResolver() {
    const { FilterResolver } = await loadAsync<typeof import('Controls/search')>('Controls/search');
    return FilterResolver;
}

async function oldSearch(
    props,
    currentState,
    nextState,
    snapshots,
    dispatch,
    getState,
    applyState,
    originalSliceGetState,
    registerPendingPromise
) {
    applyState({
        searchInputValue: nextState.searchInputValue,
    });
    return searchLoader(
        currentState,
        nextState,
        nextState.searchValue,
        props,
        snapshots,
        dispatch,
        registerPendingPromise
    )
        .then(({ items, root, searchValue }) => {
            const stateAfterSearch = {
                ...nextState,
                root,
                searchValue,
                searchInputValue: originalSliceGetState().searchInputValue,
                viewCommands: [...nextState.viewCommands, 'resetScroll'],
            };

            const dLoadedSuccess = getDecomposedPromise<Partial<IListState>>();

            return dispatch(
                ListActionCreators.source.dataLoadedSuccess({
                    items,
                    nextState: stateAfterSearch,
                    additionalPromise: undefined,
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
                    await resultState.sourceController?.setItemsAfterLoad(items as RecordSet);

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
}

async function oldResetSearch(
    props,
    currentState,
    nextState,
    snapshots,
    dispatch,
    getState,
    applyState,
    originalSliceGetState,
    registerPendingPromise
) {
    applyState({
        loading: true,
        searchMisspellValue: '',
        searchInputValue: nextState.searchInputValue,
    });
    return resetSearch(currentState, nextState, props, snapshots, dispatch, registerPendingPromise)
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
                        viewCommands: [...nextState.viewCommands, 'resetScroll'],
                    },
                    additionalPromise: undefined,
                    currentState,

                    onResolve: dLoadedSuccess.resolve,
                    onReject: dLoadedSuccess.reject,
                })
            )
                .then(() => dLoadedSuccess.promise)
                .then(async (newState: IListState) => {
                    await newState.sourceController?.setItemsAfterLoad(newItems as RecordSet);

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
                    };
                });
        })
        .catch((error) => {
            return getStateAfterLoadError(currentState, nextState, error, {
                root: currentState.root,
            });
        });
}

async function searchLoader(
    currentState: IListState,
    nextState: IListState = currentState,
    value: string,
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher,
    snapshots: ISnapshotsStore,
    dispatch: Function,
    registerPendingPromise: Function
): Promise<unknown> {
    const FilterResolver = await getFilterResolver();

    let searchValue = value;
    if (currentState.searchValueTrim) {
        searchValue = value && value.trim();
    }
    if (!currentState.searchValue) {
        snapshots.set(SnapshotName.BeforeSearch, {
            ...snapshots.get(SnapshotName.BeforeSearch),
            root: undefined,
            hasHierarchyFilter: FilterResolver.hasHierarchyFilter(nextState.filter),
            hasRootInFilter: nextState.filter.hasOwnProperty(currentState.parentProperty),
        });
    }
    const { sourceController, viewMode, parentProperty } = nextState;
    const searchViewMode = resolveSearchViewMode(nextState.adaptiveSearchMode, viewMode);
    const breadCrumbsItems =
        snapshots.get(SnapshotName.BeforeShowOnlySelected)?.breadCrumbsItems ||
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
            snapshots.set(SnapshotName.BeforeSearch, {
                hasHierarchyFilter: false,
                hasRootInFilter: false,
                ...snapshots.get(SnapshotName.BeforeSearch),
                root: currentRoot,
            });
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
        snapshots.get(SnapshotName.BeforeSearch)?.root
    );
    if (!nextState.deepReload && !sourceController?.isExpandAll()) {
        sourceController?.setExpandedItems([]);
    }
    if (props.sliceCallbacks.isDestroyed()) {
        return Promise.reject('Ошибка поиска. Слайс разрушен');
    }
    const dOldSliceLoad = getDecomposedPromise();
    const dPromise = registerPendingPromise('DoldSliceLoad', dOldSliceLoad.promise);

    await dispatch(
        ListActionCreators.source.oldSliceLoad({
            state: nextState,
            key: rootForSearch,
            filter: filterForSearch,
            addItemsAfterLoad: false,
            onResolve: dOldSliceLoad.resolve,
            onReject: dOldSliceLoad.reject,
            isDefaultError: false,
        })
    );

    const items = await dPromise;

    return {
        items,
        root: rootForSearch,
        searchValue: FilterResolver.needChangeSearchValueToSwitchedString(items)
            ? FilterResolver.getSwitcherStrFromData(items)
            : searchValue,
    };
}

async function resetSearch(
    currentState: IListState,
    nextState: IListState,
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher,
    snapshots: ISnapshotsStore,
    dispatch: Function,
    registerPendingPromise: Function
): Promise<unknown> {
    const FilterResolver = await getFilterResolver();

    const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);
    const filter = FilterResolver.getResetSearchFilter(
        nextState.filter,
        // FIXME: Types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        nextState.searchParam,
        nextState.parentProperty,
        !beforeSearchSnapshot?.hasHierarchyFilter,
        !beforeSearchSnapshot?.hasRootInFilter
    );

    if (beforeSearchSnapshot?.root !== undefined && currentState.parentProperty) {
        props.sliceProperties.sourceController?.setRoot(beforeSearchSnapshot.root);
    }
    nextState.sourceController?.setFilter(filter);
    const sourceControllerOptions =
        ListWebInitializers.source.getSourceControllerOptions(nextState);
    nextState.sourceController?.updateOptions({
        ...sourceControllerOptions,
        root: nextState.sourceController.getRoot(),
        filter,
    });

    if (props.sliceCallbacks.isDestroyed()) {
        return Promise.reject('Ошибка поиска. Слайс разрушен');
    }
    const dReload = getDecomposedPromise<unknown>();
    const dReloadPromise = registerPendingPromise('DreloadOnSourceController', dReload.promise);

    await dispatch(
        ListActionCreators.source.reloadOnSourceController({
            sourceController: (nextState || currentState).sourceController,
            addItemsAfterLoad: false,
            onResolve: dReload.resolve,
            onReject: dReload.reject,
        })
    );

    return dReloadPromise;
}
