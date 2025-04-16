/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMiddleware, IListState, TListMiddlewareContext } from 'Controls-DataEnv/list';
import type { RecordSet } from 'Types/collection';
import type { TViewCommand } from 'Controls-DataEnv/listTypes';
import type { CrudEntityKey } from 'Types/source';

import { ListWebInitializers } from 'Controls/dataFactory';
import { _private_DecomposedPromise, Initializer } from 'Controls-DataEnv/abstractList';
import {
    _privateForOldCode_ISnapshotsStore as ISnapshotsStore,
    ListActionCreators,
    SnapshotName,
    TListActions,
} from 'Controls-DataEnv/list';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { resolveSearchViewMode, getStateAfterLoadError } from './utils';

const { getDecomposedPromise } = _private_DecomposedPromise;

const { selection: selectionActions, marker: markerActions } = ListActionCreators;

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
        getCollection,
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
                const collection = getCollection();

                if (!collection) {
                    break;
                }

                const hasMoreInRoot = state.hasMoreStorage[String(state.root)];
                if (
                    Initializer.selection
                        .getSelectionStrategy(state)
                        .isAllSelected(
                            { ...state, collection },
                            hasMoreInRoot && (hasMoreInRoot.backward || hasMoreInRoot.forward),
                            collection.getCount(),
                            0,
                            false
                        )
                ) {
                    await dispatch(selectionActions.resetSelection());
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
                                oldSearch({
                                    props: getTrashBox()._propsForMigrationToDispatcher,
                                    currentState: originalSliceGetState(),
                                    nextState: getState(),
                                    snapshots,
                                    dispatch,
                                    applyState,
                                    originalSliceGetState,
                                    registerPendingPromise,
                                })
                            );
                        } else if (originalSliceGetState().root === getState().root) {
                            newState = await registerPendingPromise(
                                'awaitAllRequests',
                                oldResetSearch({
                                    props: getTrashBox()._propsForMigrationToDispatcher,
                                    currentState: originalSliceGetState(),
                                    nextState: getState(),
                                    snapshots,
                                    dispatch,
                                    applyState,
                                    registerPendingPromise,
                                })
                            );
                        }
                        if (newState) {
                            setState(newState);
                        }
                    } catch (error) {
                        setState(
                            getStateAfterLoadError(
                                originalSliceGetState(),
                                getState(),
                                error as Error,
                                {
                                    root: originalSliceGetState().root,
                                }
                            ) as Partial<IListState>
                        );
                        break;
                    }
                    const previousMarkedKey = getState().markedKey;
                    const collection = getState().collection;
                    if (getState().fix88221034303402 && previousMarkedKey && collection) {
                        scheduleDispatch(markerActions.markNearbyItem(-1, previousMarkedKey));
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

type OldSearchArguments = {
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher | null;
    currentState: IListState;
    nextState: IListState;
} & Pick<
    TListMiddlewareContext,
    'snapshots' | 'dispatch' | 'applyState' | 'originalSliceGetState' | 'registerPendingPromise'
>;

async function oldSearch({
    props,
    currentState,
    nextState,
    snapshots,
    dispatch,
    applyState,
    originalSliceGetState,
    registerPendingPromise,
}: OldSearchArguments) {
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
                viewCommands: [...nextState.viewCommands, 'resetScroll'] as TViewCommand[],
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
                .then(async (resultState: Partial<IListState>) => {
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

type OldResetSearchArguments = {
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher | null;
    currentState: IListState;
    nextState: IListState;
} & Pick<
    TListMiddlewareContext,
    'snapshots' | 'dispatch' | 'applyState' | 'registerPendingPromise'
>;

async function oldResetSearch({
    props,
    currentState,
    nextState,
    snapshots,
    dispatch,
    applyState,
    registerPendingPromise,
}: OldResetSearchArguments) {
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
                .then(async (newState: Partial<IListState>) => {
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
                    };
                });
        })
        .catch((error) => {
            return getStateAfterLoadError(currentState, nextState, error, {
                root: currentState.root,
            });
        });
}

type SearchLoaderResult = {
    items: RecordSet;
    searchValue: string;
    root?: CrudEntityKey;
};

async function searchLoader(
    currentState: IListState,
    nextState: IListState = currentState,
    value: string,
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher | null,
    snapshots: ISnapshotsStore,
    dispatch: Function,
    registerPendingPromise: Function
): Promise<SearchLoaderResult> {
    const FilterResolver = await getFilterResolver();

    let searchValue = value;
    if (currentState.searchValueTrim) {
        searchValue = value && value.trim();
    }
    if (!currentState.searchValue) {
        snapshots.set(SnapshotName.BeforeSearch, {
            ...snapshots.get(SnapshotName.BeforeSearch),
            root: undefined,
            hasHierarchyFilter:
                !!nextState.filter &&
                FilterResolver.hasHierarchyFilter(nextState.filter as Record<string, unknown>),
            hasRootInFilter:
                !!currentState.parentProperty &&
                !!nextState.filter?.hasOwnProperty(currentState.parentProperty),
        });
    }
    const { sourceController, viewMode, parentProperty } = nextState;
    const searchViewMode = resolveSearchViewMode(!!nextState.adaptiveSearchMode, viewMode);
    const breadCrumbsItems =
        snapshots.get(SnapshotName.BeforeShowOnlySelected)?.breadCrumbsItems ||
        nextState.breadCrumbsItems;
    const rootForSearch =
        parentProperty &&
        FilterResolver.getRootForSearch(
            breadCrumbsItems,
            nextState.root as CrudEntityKey,
            parentProperty,
            nextState.searchStartingWith
        );
    if (viewMode !== searchViewMode && props?.sliceProperties) {
        const currentRoot = props.sliceProperties.sourceController?.getRoot();

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

    if (!nextState.searchParam) {
        return Promise.reject('Ошибка поиска. searchParam не задан');
    }

    const filterForSearch =
        nextState.filter &&
        FilterResolver.getFilterForSearch(
            {
                filter: nextState.filter,
                root: nextState.root as CrudEntityKey,
                deepReload: nextState.deepReload,
                parentProperty: nextState.parentProperty,
                searchParam: nextState.searchParam,
                searchStartingWith: nextState.searchStartingWith,
                breadCrumbsItems,
                sourceController: nextState.sourceController,
            },
            searchValue,
            snapshots.get(SnapshotName.BeforeSearch)?.root as CrudEntityKey | undefined
        );
    if (!nextState.deepReload && !sourceController?.isExpandAll()) {
        sourceController?.setExpandedItems([]);
    }
    if (props?.sliceCallbacks.isDestroyed()) {
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
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher | null,
    snapshots: ISnapshotsStore,
    dispatch: Function,
    registerPendingPromise: Function
): Promise<RecordSet> {
    const FilterResolver = await getFilterResolver();

    const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);

    if (!nextState.filter) {
        return Promise.reject('Ошибка поиска. Фильтр не задан');
    }

    if (!nextState.searchParam) {
        return Promise.reject('Ошибка поиска. searchParam не задан');
    }

    const filter = FilterResolver.getResetSearchFilter(
        nextState.filter,
        nextState.searchParam,
        nextState.parentProperty ?? '',
        !beforeSearchSnapshot?.hasHierarchyFilter,
        !beforeSearchSnapshot?.hasRootInFilter
    );

    if (
        beforeSearchSnapshot?.root !== undefined &&
        currentState.parentProperty &&
        props?.sliceProperties?.sourceController
    ) {
        props?.sliceProperties.sourceController.setRoot(beforeSearchSnapshot.root);
    }

    if (nextState.sourceController) {
        nextState.sourceController.setFilter(filter);

        const sourceControllerOptions =
            ListWebInitializers.source.getSourceControllerOptions(nextState);

        nextState.sourceController.updateOptions({
            ...sourceControllerOptions,
            root: nextState.sourceController.getRoot(),
            filter,
        });
    }

    if (props?.sliceCallbacks.isDestroyed()) {
        return Promise.reject('Ошибка поиска. Слайс разрушен');
    }

    const sourceController = (nextState ?? currentState).sourceController;

    if (!sourceController) {
        return Promise.reject('Ошибка поиска. sourceController не задан');
    }

    const dReload = getDecomposedPromise<RecordSet>();
    const dReloadPromise = registerPendingPromise('DreloadOnSourceController', dReload.promise);

    await dispatch(
        ListActionCreators.source.reloadOnSourceController({
            sourceController,
            addItemsAfterLoad: false,
            onResolve: dReload.resolve,
            onReject: dReload.reject,
        })
    );

    return dReloadPromise;
}
