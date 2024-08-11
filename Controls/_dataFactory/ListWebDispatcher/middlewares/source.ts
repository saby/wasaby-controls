import { TListMiddlewareCreator } from '../types/TListMiddleware';
import {
    withLogger,
    Logger as DispatcherLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';
import { getDecomposedPromise } from 'Controls/_dataFactory/helpers/DecomposedPromise';
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import { IBaseSourceConfig } from 'Controls/_interface/INavigation';
import { TLoadResult } from 'Controls/_dataFactory/List/Slice';
import { RecordSet } from 'Types/collection';
import getStateAfterLoadError from 'Controls/_dataFactory/List/resources/error';
import { hasItemInArray } from 'Controls/_dataFactory/AbstractList/utils/itemUtils';
import type { Direction } from 'Controls/_interface/IQueryParams';
import type { TKey } from 'Controls/interface';
import { resolveSearchViewMode } from 'Controls/_dataFactory/List/utils';
import { isEqual } from 'Types/object';
import type { IMarkerState } from 'Controls/_listAspects/_markerListAspect/IMarkerState';
import { AspectsNames } from 'Controls/_dataFactory/AbstractList/_interface/AspectsNames';
import { IHasMoreStorage } from 'Controls/baseTree';
import { CrudEntityKey } from 'Types/source';
import { calculateBreadcrumbsData } from 'Controls/dataSource';
import { loadSync } from 'WasabyLoader/ModulesLoader';

import { SnapshotName } from 'Controls/_dataFactory/ListWebDispatcher/types/SnapshotName';
import { ISnapshotsStore } from 'Controls/_dataFactory/ListWebDispatcher/types/ISnapshotsStore';

import * as sourceActions from '../actions/source';
import * as stateActions from '../actions/state';
import { TMiddlewaresPropsForMigrationToDispatcher } from '../actions/beforeApplyState';

import { saveState } from './_source';
import { getSelectionViewMode } from './operationsPanel';
import { getActiveElementByItems } from './_navigation';
import { processMarkedKey } from './marker';
import { getSourceControllerOptions, reloadSourceController } from './_loadData';

const getSearchResolver = () =>
    loadSync<typeof import('Controls/search')>('Controls/search').FilterResolver;

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'source',
    actionsNames: [
        'updateSavedSourceState',
        'setSavedSourceState',
        'reload',
        'load',
        'requestFetch',
        'fetch',
        'initSource',
        'awaitAllRequests',
        'complexUpdateSource',
    ],
});

export const source: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch, getCollection, getTrashBox, originalSliceSetState, snapshots } =
        withLogger(ctx, 'source');
    let needReload = false;

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'setSavedSourceState': {
                saveState({
                    ...getState(),
                    listConfigStoreId: action.payload.id,
                    ...action.payload.state,
                });
                break;
            }
            case 'reload': {
                let { sourceConfig } = action.payload;
                const { keepNavigation, onResolve, onReject } = action.payload;

                const { promise: onDataLoadedPromise, resolve: onDataLoadedPromiseResolve } =
                    getDecomposedPromise();
                const immediateState = {
                    loading: true,
                };

                if (keepNavigation) {
                    immediateState.keepNavigationSliceReloadId = Date.now();
                }

                await dispatch(stateActions.setState(immediateState, 'immediate'));
                await dispatch(
                    stateActions.setState({
                        promiseResolverForReloadOnly: onDataLoadedPromiseResolve,
                    })
                );

                const state = getState();
                const { _propsForMigrationToDispatcher } = getTrashBox();

                if (!sourceConfig && keepNavigation) {
                    const navigation = state.navigation;
                    const isMultiNavigation = !!navigation?.sourceConfig?.multiNavigation;
                    const itemsCount = getCollection()
                        ? getCollection()?.getSourceCollectionCount()
                        : getState().sourceController?.getItems?.()?.getCount?.();

                    if (!isMultiNavigation && navigation?.source === 'page') {
                        const navPageSize = navigation.sourceConfig.pageSize;
                        const pageSize = Math.max(
                            Math.ceil(itemsCount / navPageSize) * navPageSize,
                            navPageSize
                        );
                        sourceConfig = {
                            ...navigation.sourceConfig,
                            page: 0,
                            pageSize,
                        };
                    }
                }

                _propsForMigrationToDispatcher.sliceProperties.loadConfig = {
                    sourceConfig,
                    keepNavigation,
                };

                // нужен механизм регистрации висячих пендингов
                // добавить по задаче: https://online.sbis.ru/opendoc.html?guid=3103a015-07aa-4421-a3ab-13301eb00aad&client=3
                state.sourceController
                    ?.reload(sourceConfig, false, false, keepNavigation)
                    ?.then(async (items) => {
                        _propsForMigrationToDispatcher.sliceProperties.newItems = items;
                        if (state.loading) {
                            originalSliceSetState({
                                loading: false,
                            });
                        } else {
                            //TODO: Перезагрузка должна всегда вешать промис. Это костыль на случай, когда за время загрузки сбросили флаг loading
                            originalSliceSetState({
                                newReloadedItems: items,
                            });
                        }

                        onDataLoadedPromise.then(() => {
                            // Необходимо гарантировать, чтобы reload разрешался сразу после исполнения всех обновлений от notify dataLoaded
                            // без setTimeout в очередь микротаск попадают сначала обработчики reload, затем dataLoaded
                            setTimeout(() => {
                                onResolve(items);
                            }, 0);
                        });
                    })
                    ?.catch(async (error) => {
                        // TODO: !!!!!!
                        if (!error?.isCanceled) {
                            originalSliceSetState({
                                loading: false,
                            });
                        }
                        onReject(error);
                    });
                break;
            }
            case 'updateSavedSourceState': {
                const currentState = getState();

                if (!currentState.listConfigStoreId) {
                    break;
                }

                await dispatch(
                    sourceActions.setSavedSourceState(currentState.listConfigStoreId, {
                        selectedKeys: currentState.selectedKeys,
                        excludedKeys: currentState.excludedKeys,
                        searchValue: currentState.searchValue,
                        expandedItems: currentState.expandedItems,
                        markedKey: currentState.markedKey,
                    })
                );

                break;
            }

            case 'load': {
                const snapshotBeforeUpdate = snapshots.get(SnapshotName.BeforeComplexUpdate);
                if (snapshotBeforeUpdate?.isComplexUpdate) {
                    await dispatch(sourceActions.requestFetch());
                } else {
                    await dispatch(sourceActions.fetch());
                }
                break;
            }
            case 'requestFetch': {
                needReload = true;
                break;
            }
            case 'fetch': {
                const { _propsForMigrationToDispatcher } = getTrashBox();
                const snapshotBeforeComplexUpdate = snapshots.get(SnapshotName.BeforeComplexUpdate);
                if (getState().sourceController === undefined) {
                    await dispatch(sourceActions.initSource());
                }
                const needReloadBySourceControllerInner =
                    getState()?.sourceController?.updateOptions(
                        getSourceControllerOptions(getState())
                    ) || snapshotBeforeComplexUpdate?._needReloadBySourceController;
                if (needReloadBySourceControllerInner) {
                    await dispatch(
                        stateActions.setState(
                            {
                                loading: true,
                            },
                            'immediate'
                        )
                    );
                    const newState = await reloadFromBAS({
                        nextState: getState(),
                        currentState: getState('original'),
                        navigationSourceConfig: getState()?.navigation?.sourceConfig,
                        viewModePromise: snapshotBeforeComplexUpdate?.additionalPromise,
                        props: _propsForMigrationToDispatcher,
                        snapshots,
                    });
                    await dispatch(stateActions.setState(newState));
                }
                break;
            }
            case 'initSource': {
                const { _propsForMigrationToDispatcher } = getTrashBox();

                await dispatch(
                    stateActions.setState({
                        sourceController:
                            _propsForMigrationToDispatcher.sliceCallbacks.getSourceController(
                                getSourceControllerOptions(getState())
                            ),
                    })
                );
                _propsForMigrationToDispatcher.sliceProperties.sourceController =
                    getState().sourceController;
                break;
            }
            case 'awaitAllRequests': {
                if (needReload) {
                    await dispatch(sourceActions.fetch());
                }
            }
            case 'complexUpdateSource': {
                const { prevState } = action.payload;
                const { _propsForMigrationToDispatcher } = getTrashBox();

                if (prevState?.sourceController !== getState().sourceController) {
                    _propsForMigrationToDispatcher.sliceCallbacks.unsubscribeFromSourceController();
                    _propsForMigrationToDispatcher.sliceProperties.sourceController =
                        getState().sourceController;

                    if (!getState().sourceController) {
                        getState().sourceController =
                            _propsForMigrationToDispatcher.sliceCallbacks.getSourceController(
                                getSourceControllerOptions(prevState)
                            );
                    } else {
                        // должно уехать отсюда в items
                        await dispatch(
                            stateActions.setState({
                                items: getState().sourceController?.getItems(),
                            })
                        );
                    }
                }
                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};

function reloadFromBAS({
    nextState,
    currentState,
    navigationSourceConfig,
    viewModePromise,
    snapshots,
    props,
}: {
    currentState: IListState;
    nextState: IListState;
    navigationSourceConfig: IBaseSourceConfig;
    viewModePromise?: Promise<unknown>;
    snapshots: ISnapshotsStore;
    props: TMiddlewaresPropsForMigrationToDispatcher;
}) {
    return reloadSourceController(
        nextState || currentState,
        navigationSourceConfig,
        nextState.keepNavigation
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
                snapshots,
            }).then((dataLoadedResult) => {
                nextState.sourceController?.setItemsAfterLoad(
                    items as RecordSet,
                    navigationSourceConfig,
                    nextState.keepNavigation
                );
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
            return getStateAfterLoadError(currentState, nextState, error, { root: nextState.root });
        });
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

type TDataLoadedInnerParams = Pick<
    TGetLoadResultParams,
    'currentState' | 'nextState' | 'props' | 'snapshots'
> & {
    items: TLoadResult;
    direction: Direction | undefined;
    nextState: IListState;
    additionalPromise?: Promise<unknown>;
    key?: TKey;
};

async function dataLoadedInner({
    items,
    direction,
    currentState,
    nextState,
    additionalPromise,
    key,
    props,
    snapshots,
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
                snapshots,
                props,
            }),
        };
    });
}

type TGetLoadResultParams = {
    currentState: IListState;
    nextState: IListState;
    items: RecordSet;
    props: TMiddlewaresPropsForMigrationToDispatcher;
    snapshots: ISnapshotsStore;
};

function getLoadResult({
    currentState,
    nextState,
    items,
    props,
    snapshots,
}: TGetLoadResultParams): Partial<IListState> {
    const sourceController = nextState.sourceController;
    const searchViewMode = resolveSearchViewMode(
        currentState.adaptiveSearchMode,
        props.sliceProperties.previousViewMode
    );
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
        const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);
        if (searchValue) {
            newFilter = getSearchResolver().getFilterForSearch(
                nextState,
                nextState.searchValue,
                beforeSearchSnapshot?.root
            );
        } else if (currentState.searchParam) {
            newFilter = getSearchResolver().getResetSearchFilter(
                nextState.filter,
                nextState.searchParam,
                nextState.parentProperty,
                !beforeSearchSnapshot?.hasHierarchyFilter,
                !beforeSearchSnapshot?.hasRootInFilter
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
            ? loadSync<typeof import('Controls/search')>(
                  'Controls/search'
              ).FilterResolver.getSwitcherStrFromData(
                  items || props.sliceProperties.sourceController?.getItems()
              )
            : '',
    } as Partial<IListState>;
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

function loadNodes({
    keys,
    currentState,
    nextState,
    props,
}: {
    keys: TKey[];
    currentState: IListState;
    nextState: IListState;
    props: TMiddlewaresPropsForMigrationToDispatcher;
}): Promise<IListState> | void {
    const nodeLoadersPromises: Promise<void>[] = [];
    keys.forEach((key: TKey) => {
        if (currentState.sourceController && !currentState.sourceController.hasLoaded(key)) {
            nodeLoadersPromises.push(
                // TODO: Тип direction - темная магия помноженная на издевательство,
                //  в разных местах передается void 0, undefined, null и string.
                //  Причем null делает одно, void 0 и undefined другое, а string третье.
                //  Не зная не поймешь, такого быть не должно.
                //
                props.sliceCallbacks
                    .load(nextState, void 0, key, void 0, void 0, void 0, true)
                    .then(() => {})
            );
        }
    });

    if (nodeLoadersPromises.length) {
        return Promise.all(nodeLoadersPromises)
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
            });
    } else {
        nextState.hasMoreStorage = getHasMoreStorage(nextState);
    }
}

export { loadNodes, dataLoadedInner, getStateAfterUpdateItems, reloadFromBAS };
