/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    type TListMiddleware,
    type IListState,
    type TListMiddlewareContext,
    getDecomposedPromise,
    ListWebInitializers,
    ListWebActions,
    _private,
} from 'Controls/dataFactory';
import { SnapshotName, IListStateParts, type TListActions } from 'Controls-DataEnv/list';
import type { PromiseCanceledError } from 'Types/entity';

import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';

import type {
    IBaseSourceConfig,
    IBasePositionSourceConfig,
    Direction,
    TKey,
} from 'Controls/interface';
import { type IListSavedState, saveControllerState } from 'Controls/dataSource';

import { isEqual } from 'Types/object';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { calculateBreadcrumbsData } from 'Controls/dataSource';
import type { Tree } from 'Controls/baseTreeDisplay';
import type { ISnapshotsStore } from 'Controls-DataEnv/newLists/_list/types/ISnapshotsStore';
import type { _private_TMiddlewaresPropsForMigrationToDispatcher } from 'Controls-DataEnv/abstractList';

const {
    resolveSearchViewMode,
    getSelectionViewMode,
    getStateAfterLoadError,
    getActiveElementByItems,
} = _private;

const {
    createSourceController,
    getSourceControllerOptions,
    initHasMoreStorage: getHasMoreStorage,
} = ListWebInitializers.source;

const getSearchResolver = () =>
    loadSync<typeof import('Controls/search')>('Controls/search').FilterResolver;

// Именно функции, иначе будет потерян стек ошибки.
const ERROR_DESCRIPTORS = {
    SOURCE_CONTROLLER_IS_UNDEFINED: () => new Error('sourceController is undefined!'),
};

function hasItemInArray(items: Model[], key: TKey | undefined): boolean {
    return !!items.find((item) => item.getKey() === key);
}

type TLoadResult = RecordSet | Error;

export type TListSourceMiddlewareContext = TListMiddlewareContext & {
    onNodeDataLoaded?: (
        items: RecordSet,
        key: TKey,
        direction: Direction,
        nextState: IListState
    ) => Partial<IListState> | Promise<Partial<IListState>>;
    onDataLoaded?: (
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ) => Partial<IListState> | Promise<Partial<IListState>>;
};

export const source: TListMiddleware = (ctx: TListSourceMiddlewareContext) => {
    const {
        getState,
        originalSliceGetState,
        setState,
        applyState,
        dispatch,
        getCollection,
        getTrashBox,
        originalSliceSetState,
        snapshots,
        scheduleDispatch,
        onDataLoaded,
        onNodeDataLoaded,
        registerPendingPromise,
    } = ctx;
    let needReload = false;
    let loadParams = {};

    const applyLoading = async (state: boolean) =>
        applyState({
            loading: state,
        });

    const getTrashProps = () => getTrashBox()._propsForMigrationToDispatcher;

    return (next) => async (action: TListActions.TAnyListAction) => {
        // Должен быть fetch и scheduleFetch.
        // Не может(или может, но не должно быть) за одну модификацию несколько загрузок.
        // Мы планируем загрузку, запоминаем параметры, а затем в какой-то момент загружаем.
        // Возможно, придется бегать по параметрам, набирать то что хочется.
        // Например, запланировали 3 перезагрузки, делаем одну с последними/"наибольшими" параметрами.
        switch (action.type) {
            case 'setSavedSourceState': {
                saveState({
                    ...getState(),
                    listConfigStoreId: action.payload.id,
                    ...action.payload.state,
                });
                break;
            }
            case 'newItemsReceived': {
                const {
                    items: newItems,
                    currentState = getState(),
                    nextState = currentState,
                    loadConfig,
                    itemsDirection: direction,
                    additionalPromise,
                    onResolve,
                } = action.payload;

                const sourceConfig = loadConfig?.sourceConfig;
                const keepNavigation = loadConfig?.keepNavigation;

                const dLoadedSuccess = getDecomposedPromise<Partial<IListState>>();

                await dispatch(
                    ListWebActions.source.dataLoadedSuccess({
                        items: newItems as RecordSet,
                        direction,
                        nextState,
                        additionalPromise,
                        currentState,

                        onResolve: dLoadedSuccess.resolve,
                        onReject: dLoadedSuccess.reject,
                    })
                );

                const newState = await dLoadedSuccess.promise;

                await nextState.sourceController?.setItemsAfterLoad(
                    newItems,
                    sourceConfig,
                    keepNavigation,
                    direction
                );

                if (nextState._loadItemsToDirectionPromiseResolver) {
                    nextState._loadItemsToDirectionPromiseResolver();
                    delete nextState._loadItemsToDirectionPromiseResolver;
                }

                const stateAfterUpdateItems = {
                    current: {},
                };

                await dispatch(
                    ListWebActions.source.resolveStateAfterUpdateItems({
                        currentState,
                        nextState: newState,
                        resultRef: stateAfterUpdateItems,
                    })
                );

                setState({
                    ...nextState,
                    ...newState,
                    ...stateAfterUpdateItems.current,
                });

                if (onResolve) {
                    onResolve(getState());
                }

                break;
            }
            case 'reload': {
                let { sourceConfig } = action.payload;
                const { keepNavigation, onResolve, onReject } = action.payload;

                const sourceController = getState().sourceController;
                if (!sourceController) {
                    onReject?.(ERROR_DESCRIPTORS.SOURCE_CONTROLLER_IS_UNDEFINED());
                    break;
                }

                // Загрузка + костыль для сохранения позиции при перезагрузке.
                applyState({
                    loading: true,
                    keepNavigationSliceReloadId: keepNavigation ? Date.now() : undefined,
                });

                const state = getState();
                const { sliceProperties } = getTrashProps();

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

                sliceProperties.loadConfig = {
                    sourceConfig,
                    keepNavigation,
                };

                await dispatch(
                    ListWebActions.source.reloadOnSourceController({
                        sourceController,
                        sourceConfig,
                        addItemsAfterLoad: false,
                        keepNavigation,

                        onResolve: (items) => {
                            scheduleDispatch(
                                ListWebActions.source.newItemsReceived({
                                    items,
                                    loadConfig: { ...sliceProperties.loadConfig },
                                    onResolve: () => {
                                        // Необходимо гарантировать, чтобы reload разрешался сразу после исполнения всех обновлений от notify dataLoaded
                                        // без setTimeout в очередь микротаск попадают сначала обработчики reload, затем dataLoaded
                                        setTimeout(() => {
                                            onResolve?.(items);
                                        }, 0);
                                    },
                                    onReject,
                                })
                            );
                        },
                        onReject: (error) => {
                            // TODO: !!!!!!
                            if (!error?.isCanceled) {
                                originalSliceSetState({
                                    loading: false,
                                });
                                onReject?.(error);
                            } else {
                                onResolve?.(null);
                            }
                        },
                    })
                );

                break;
            }
            case 'updateSavedSourceState': {
                const currentState = getState();

                if (!currentState.listConfigStoreId) {
                    break;
                }

                await dispatch(
                    ListWebActions.source.setSavedSourceState(currentState.listConfigStoreId, {
                        selectedKeys: currentState.selectedKeys,
                        excludedKeys: currentState.excludedKeys,
                        searchValue: currentState.searchValue,
                        expandedItems: currentState.expandedItems,
                        markedKey: currentState.markedKey,
                    })
                );

                break;
            }

            case 'loadOnSourceController': {
                const {
                    // FIXME: Замкнутый стейт будет неактуальным на момент резолва промиса,
                    //  если в диспатчере не ждали всю операцию целиком!
                    state = originalSliceGetState(),
                    direction,
                    key,
                    filter,
                    addItemsAfterLoad,
                    navigationSourceConfig,
                    keepNavigation,
                    useServicePool,
                    onResolve,
                    onReject,
                } = action.payload;

                if (!state.sourceController) {
                    onReject?.(ERROR_DESCRIPTORS.SOURCE_CONTROLLER_IS_UNDEFINED());
                    break;
                }

                registerPendingPromise(
                    Symbol('listWebReducers/loadOnSourceController'),
                    state.sourceController.load(
                        direction,
                        key,
                        filter,
                        addItemsAfterLoad,
                        navigationSourceConfig,
                        keepNavigation,
                        useServicePool
                    )
                )
                    .then((result) => {
                        return onResolve?.(result);
                    })
                    .catch((error) => {
                        return onReject?.(error);
                    });

                break;
            }

            case 'reloadOnSourceController': {
                const {
                    // FIXME: Замкнутый стейт будет неактуальным на момент резолва промиса,
                    //  если в диспатчере не ждали всю операцию целиком!
                    sourceController,
                    sourceConfig,
                    isFirstLoad,
                    addItemsAfterLoad,
                    keepNavigation,
                    onResolve,
                    onReject,
                } = action.payload;

                if (!sourceController) {
                    onReject?.(ERROR_DESCRIPTORS.SOURCE_CONTROLLER_IS_UNDEFINED());
                    break;
                }

                registerPendingPromise(
                    Symbol('listWebReducers/reloadOnSourceController'),
                    sourceController.reload(
                        sourceConfig,
                        isFirstLoad,
                        addItemsAfterLoad,
                        keepNavigation
                    )
                )
                    .then((items) => {
                        onResolve?.(items);
                    })
                    .catch((e) => {
                        onReject?.(e);
                    });

                break;
            }

            case 'updateHasMoreStorage': {
                setState({
                    hasMoreStorage:
                        action.payload.hasMoreStorage ??
                        getHasMoreStorage(action.payload.nextState),
                });

                if (action.payload.hasMoreStorage) {
                    // На вебе коллекция не готова перестраивать свои подвалы и заголовки узлов в правильные моменты.
                    // https://online.sbis.ru/opendoc.html?guid=afb227d2-a39b-415c-9372-e3eb9abc91b1&client=3
                    const collection = getCollection();
                    (collection as unknown as Tree).setHasMoreStorage?.(
                        action.payload.hasMoreStorage,
                        collection.isThinInteractor()
                    );
                }
                break;
            }

            case 'loadNodes': {
                const { keys, currentState, nextState, onResolve } = action.payload;

                const nodeLoadersPromises: Promise<void>[] = [];

                for (const key of keys) {
                    const needLoad =
                        !!currentState.sourceController &&
                        !currentState.sourceController.hasLoaded(key);
                    if (!needLoad) {
                        continue;
                    }

                    const dPromise = getDecomposedPromise<void>();

                    await dispatch(
                        ListWebActions.source.oldSliceLoad({
                            state: nextState,
                            key,
                            disableSetState: true,
                            onResolve: dPromise.resolve,
                            onReject: dPromise.reject,
                        })
                    );

                    nodeLoadersPromises.push(dPromise.promise);
                }

                if (!nodeLoadersPromises.length) {
                    const newNextState = {
                        ...nextState,
                        hasMoreStorage: getHasMoreStorage(nextState),
                    };
                    await dispatch(
                        ListWebActions.items.complexUpdateItems(currentState, newNextState)
                    );

                    onResolve?.(newNextState);
                } else {
                    registerPendingPromise(
                        Symbol('liseWebReducers/loadNodes'),
                        Promise.all(nodeLoadersPromises)
                    )
                        // Ждем успешной загрузки всех узлов, формируем новый стейт
                        .then(() => {
                            const newNextState = {
                                ...nextState,
                                hasMoreStorage: getHasMoreStorage(nextState),
                            };

                            return dispatch(
                                ListWebActions.items.complexUpdateItems(currentState, newNextState)
                            ).then(() => newNextState);
                        })
                        // Формируем новый стейт, даже если была ошибка.
                        // В таком случае мы все равно должны завершиться успешно,
                        // т.к. ошибка будет обработана дружелюбно.
                        .catch((error) => {
                            return getStateAfterLoadError(
                                currentState,
                                { ...nextState, expandedItems: currentState.expandedItems },
                                error,
                                undefined
                            );
                        })
                        // Уведомляем о завершении
                        .then((result) => {
                            onResolve?.(result);
                        });
                }
                break;
            }

            case 'load': {
                if (!getState().source) {
                    break;
                }

                const snapshotBeforeUpdate = snapshots.get(SnapshotName.ComplexUpdate);
                loadParams.sourceConfig = action.payload.sourceConfig;
                if (snapshotBeforeUpdate?.isReducingState) {
                    await dispatch(ListWebActions.source.requestFetch());
                } else {
                    await dispatch(ListWebActions.source.fetch());
                }
                break;
            }
            case 'requestFetch': {
                needReload = true;
                break;
            }
            case 'fetch': {
                const props = getTrashProps();
                const snapshotBeforeComplexUpdate = snapshots.get(SnapshotName.ComplexUpdate);
                if (getState().sourceController === undefined) {
                    await dispatch(ListWebActions.source.initSource());
                }
                const needReloadBySourceControllerInner =
                    getState()?.sourceController?.updateOptions(
                        getSourceControllerOptions(getState())
                    ) || snapshotBeforeComplexUpdate?._needReloadBySourceController;
                if (needReloadBySourceControllerInner) {
                    await applyLoading(true);
                    const newState = await reloadFromBAS({
                        nextState: getState(),
                        currentState: originalSliceGetState(),
                        navigationSourceConfig: loadParams.sourceConfig,
                        viewModePromise: snapshotBeforeComplexUpdate?.additionalPromise,
                        props,
                        snapshots,
                        dispatch,
                        onDataLoaded,
                        onNodeDataLoaded,
                    });
                    setState(newState);
                }
                break;
            }
            case 'initSource': {
                const { sliceProperties } = getTrashProps();

                setState({
                    sourceController:
                        sliceProperties.sourceController || createSourceController(getState()),
                });

                sliceProperties.sourceController = getState().sourceController;
                break;
            }

            case 'oldSliceLoad': {
                await applyLoading(true);

                const {
                    state,
                    direction,
                    key,
                    filter,
                    addItemsAfterLoad = true,
                    navigationSourceConfig,
                    awaitLoad,
                    disableSetState,
                    onResolve,
                    onReject,
                } = action.payload;

                const dLoadPromise = getDecomposedPromise<TLoadResult>();

                await dispatch(
                    ListWebActions.source.loadOnSourceController({
                        state,
                        direction,
                        key,
                        filter,
                        addItemsAfterLoad,
                        navigationSourceConfig,
                        onResolve: dLoadPromise.resolve,
                        onReject: dLoadPromise.reject,
                    })
                );

                const onThenCallback = async (result: TLoadResult) => {
                    const propsForMigration = getTrashProps();

                    if (propsForMigration.sliceCallbacks.isDestroyed() || !addItemsAfterLoad) {
                        onResolve?.(result);
                        return;
                    }

                    const nextState = state || originalSliceGetState();

                    return registerPendingPromise(
                        Symbol('liseWebReducers/oldSliceLoad/onThenCallback'),
                        dataLoadedSuccess({
                            items: result as RecordSet,
                            direction,
                            nextState: {
                                ...nextState,
                                loading: false,
                                filter: filter || nextState.filter,
                            },
                            additionalPromise: null,
                            key,
                            currentState: originalSliceGetState(),
                            previousViewMode: propsForMigration.sliceProperties.previousViewMode,
                            snapshots,
                            onDataLoaded,
                            onNodeDataLoaded,
                        })
                    ).then((newState) => {
                        if (!disableSetState) {
                            if (filter) {
                                newState.sourceController.setFilter(filter);
                            }
                            originalSliceSetState(newState);
                        }
                        onResolve?.(result);
                    });
                };

                const onCatchCallback = async (error: unknown) => {
                    // TODO: !!!!!!
                    await applyLoading(false);

                    if (needProcessError(error)) {
                        state.sourceController.setFilter(filter);
                    }

                    onReject?.(error);
                };

                if (awaitLoad) {
                    try {
                        const result = await dLoadPromise.promise;
                        await onThenCallback(result);
                    } catch (e) {
                        await onCatchCallback(e);
                    }
                } else {
                    registerPendingPromise(
                        Symbol('liseWebReducers/loadOnSourceController'),
                        dLoadPromise.promise
                    )
                        .then(onThenCallback)
                        .catch(onCatchCallback);
                }

                break;
            }

            case 'resolveStateAfterUpdateItems': {
                const { currentState, nextState = currentState, resultRef } = action.payload;
                resultRef.current = getStateAfterUpdateItems(currentState, nextState);
                break;
            }

            case 'loadToDirectionOld': {
                await applyLoading(true);

                const {
                    direction,
                    useServicePool,
                    addItemsAfterLoad = true,
                    onResolve,
                    onReject,
                } = action.payload;

                const scLoad = getDecomposedPromise<TLoadResult>();

                await dispatch(
                    ListWebActions.source.loadOnSourceController({
                        direction,
                        addItemsAfterLoad: false,
                        useServicePool,
                        onResolve: scLoad.resolve,
                        onReject: scLoad.reject,
                    })
                );

                const onThenCallback = async (items: RecordSet) => {
                    if (!addItemsAfterLoad) {
                        onResolve?.(items);
                        return;
                    }
                    const setStatePromise = getDecomposedPromise();

                    scheduleDispatch(
                        ListWebActions.source.setPreloadedItems({
                            items,
                            direction,
                            onResolve: setStatePromise.resolve,
                            onReject: setStatePromise.reject,
                        })
                    );

                    return registerPendingPromise(
                        Symbol('liseWebReducers/loadToDirectionOld/onThenCallback'),
                        setStatePromise.promise
                    ).then(() => {
                        onResolve?.(items);
                    });
                };

                const onCatchCallback = async (error: unknown) => {
                    if (needProcessError(error)) {
                        const retryAction = () => {
                            originalSliceSetState({ errorViewConfig: undefined });
                            action.payload.retryAction?.();
                        };
                        const errorConfig = await getStateAfterLoadError(
                            originalSliceGetState(),
                            originalSliceGetState(),
                            error as Error,
                            {
                                root: originalSliceGetState().root,
                                direction,
                                action: retryAction,
                            }
                        );

                        originalSliceSetState({
                            loading: errorConfig.loading,
                            errorViewConfig: errorConfig.errorViewConfig,
                            errorController: errorConfig.errorController,
                        });
                    }
                    onReject?.(error);
                };

                registerPendingPromise(Symbol('liseWebReducers/loadToDirectionOld'), scLoad.promise)
                    .then(onThenCallback)
                    .catch(onCatchCallback);

                break;
            }

            case 'setPreloadedItems': {
                const { sliceProperties } = getTrashProps();

                const { items, direction, onResolve } = action.payload;

                sliceProperties.newItems = items;
                sliceProperties.newItemsDirection = direction;

                setState({
                    _loadItemsToDirectionPromiseResolver: onResolve,
                    loading: false,
                });

                break;
            }
            case 'dataLoadedSuccess': {
                const {
                    items,
                    direction,
                    key,
                    nextState,
                    currentState,
                    additionalPromise,
                    onResolve,
                    onReject,
                } = action.payload;

                const props = getTrashProps();

                registerPendingPromise(
                    Symbol('liseWebReducers/dataLoadedSuccess'),
                    dataLoadedSuccess({
                        items,
                        direction,
                        nextState,
                        additionalPromise,
                        key,
                        currentState,
                        previousViewMode: props.sliceProperties.previousViewMode,
                        snapshots,
                        onDataLoaded,
                        onNodeDataLoaded,
                    })
                )
                    .then((res) => {
                        onResolve?.(res);
                    })
                    .catch((e) => {
                        onReject?.(e);
                    });

                break;
            }

            case 'prev': {
                await dispatch(
                    ListWebActions.source.loadToDirectionNew({
                        direction: 'up',
                    })
                );
                break;
            }

            case 'next': {
                await dispatch(
                    ListWebActions.source.loadToDirectionNew({
                        direction: 'down',
                    })
                );
                break;
            }

            case 'loadToDirectionNew': {
                const { sliceProperties } = getTrashProps();

                const { direction, onResolve, onReject } = action.payload;

                if (
                    originalSliceGetState().loading ||
                    !sliceProperties.sourceController ||
                    !sliceProperties.sourceController.hasMoreData(direction)
                ) {
                    onResolve?.();
                    break;
                }

                const dLoadPromise = getDecomposedPromise();

                await dispatch(
                    ListWebActions.source.oldSliceLoad({
                        state: originalSliceGetState(),
                        direction,
                        key: originalSliceGetState().root,
                        addItemsAfterLoad: false,
                        onResolve: dLoadPromise.resolve,
                        onReject: dLoadPromise.reject,
                    })
                );

                try {
                    const items = await dLoadPromise.promise;

                    if (items instanceof Error) {
                        throw items;
                    }
                    const navigationChanges =
                        sliceProperties.sourceController.calculateNavigationChanges(items, {
                            key: originalSliceGetState().root,
                            direction,
                        });

                    originalSliceSetState({
                        navigationChanges,
                        loading: false,
                    });

                    onResolve?.();
                } catch (error: unknown) {
                    registerPendingPromise(
                        Symbol('liseWebReducers/loadToDirectionNew'),
                        getStateAfterLoadError(
                            originalSliceGetState(),
                            originalSliceGetState(),
                            error,
                            originalSliceGetState().root
                        )
                    ).then((nextState: IListState) => {
                        originalSliceSetState(nextState);
                    });
                    onReject?.(error);
                }

                break;
            }

            case 'awaitAllRequests': {
                if (needReload) {
                    needReload = false;
                    await dispatch(ListWebActions.source.fetch());
                    loadParams = {};
                }
                break;
            }

            case 'reloadItem': {
                const { ReloadItem } =
                    await loadAsync<typeof import('Controls/listCommands')>(
                        'Controls/listCommands'
                    );

                const {
                    sourceController,
                    keyProperty,
                    nodeProperty,
                    parentProperty,
                    root,
                    items,
                    filter,
                } = getState();

                const { key, options, onResolve, onReject } = action.payload;

                const itemLoad = getDecomposedPromise();
                const addItemsAfterLoad = !options?.hierarchyReload;
                registerPendingPromise(
                    Symbol('liseWebReducers/reloadItem/ReloadItem'),
                    new ReloadItem().execute({
                        sourceController,
                        keyProperty,
                        nodeProperty,
                        parentProperty,
                        root,
                        items,
                        filter,
                        ...options,
                        itemKey: key,
                        addItemsAfterLoad,
                    })
                )
                    .then(itemLoad.resolve)
                    .catch(itemLoad.reject);
                const onThenCallback = (items: RecordSet) => {
                    if (!addItemsAfterLoad) {
                        const setStatePromise = getDecomposedPromise();

                        scheduleDispatch(
                            ListWebActions.source.setPreloadedItems({
                                items,
                                direction: undefined,
                                onResolve: setStatePromise.resolve,
                                onReject: setStatePromise.reject,
                            })
                        );

                        return registerPendingPromise(
                            Symbol('liseWebReducers/reloadItem/onThenCallback'),
                            setStatePromise.promise
                        ).then(() => {
                            return onResolve?.(items);
                        });
                    } else {
                        return onResolve?.(items);
                    }
                };

                const onCatchCallback = (error: unknown) => {
                    return onReject?.(error);
                };
                registerPendingPromise(Symbol('liseWebReducers/reloadItem'), itemLoad.promise)
                    .then(onThenCallback)
                    .catch(onCatchCallback);

                break;
            }

            case 'reloadItems': {
                const { ReloadItems } =
                    await loadAsync<typeof import('Controls/listCommands')>(
                        'Controls/listCommands'
                    );

                const {
                    sourceController,
                    keyProperty,
                    nodeProperty,
                    parentProperty,
                    root,
                    items,
                    filter,
                    expandedItems,
                } = getState();

                const { keys, onResolve, onReject } = action.payload;

                registerPendingPromise(
                    Symbol('liseWebReducers/reloadItems'),
                    new ReloadItems().execute({
                        keys,
                        keyProperty,
                        nodeProperty,
                        parentProperty,
                        expandedItems,
                        root,
                        items,
                        filter,
                        sourceController,
                    })
                )
                    .then((...args) => {
                        onResolve?.(...args);
                    })
                    .catch((...args) => {
                        onReject?.(...args);
                    });

                break;
            }

            case 'complexUpdateSource': {
                const { prevState, nextState } = action.payload;
                const { sliceProperties } = getTrashProps();

                if (prevState.sourceController !== nextState.sourceController) {
                    // Нам не нужно отписываться от старого сорс контроллера, т.к.
                    // в момент выполнения Dispatcher.dispatch мы отписаны от контроллера источника.
                    // Это обеспечивает сейчас слайс.
                    const newSourceController = nextState.sourceController
                        ? nextState.sourceController
                        : createSourceController(prevState);
                    sliceProperties.sourceController = newSourceController;
                    setState({
                        sourceController: newSourceController,
                    });

                    if (nextState.sourceController) {
                        // должно уехать в items мидлвару
                        setState({
                            items: newSourceController.getItems(),
                        });
                    }
                }
                break;
            }

            case 'rejectLoad': {
                //#region Обновление состояния
                const sourceController = getState().sourceController;
                if (sourceController && sourceController.isLoading()) {
                    sourceController.cancelLoading();
                    sourceController.updateOptions(
                        getSourceControllerOptions(originalSliceGetState())
                    );
                }
                //#endregion
                break;
            }
        }

        next(action);
    };
};

const needProcessError = (error: unknown): boolean => {
    return !error || !(error as PromiseCanceledError).isCanceled;
};

async function reloadFromBAS({
    nextState,
    currentState,
    navigationSourceConfig,
    viewModePromise,
    snapshots,
    props,
    dispatch,
    onDataLoaded,
    onNodeDataLoaded,
}: {
    currentState: IListState;
    nextState: IListState;
    navigationSourceConfig: IBaseSourceConfig;
    viewModePromise?: Promise<unknown>;
    snapshots: ISnapshotsStore;
    props: _private_TMiddlewaresPropsForMigrationToDispatcher;
    dispatch: Function;
    onDataLoaded?: TListSourceMiddlewareContext['onDataLoaded'];
    onNodeDataLoaded?: TListSourceMiddlewareContext['onNodeDataLoaded'];
}) {
    const dReloadPromise = getDecomposedPromise();

    await dispatch(
        ListWebActions.source.reloadOnSourceController({
            sourceController: (nextState || currentState).sourceController,
            sourceConfig: navigationSourceConfig,
            keepNavigation: nextState.keepNavigation,
            addItemsAfterLoad: false,
            onResolve: dReloadPromise.resolve,
            onReject: dReloadPromise.reject,
        })
    );

    return dReloadPromise.promise
        .then((items) => {
            const newState = { ...nextState };
            return dataLoadedSuccess({
                items,
                direction: undefined,
                nextState: newState,
                additionalPromise: viewModePromise,
                key: undefined,
                currentState,
                previousViewMode: props.sliceProperties.previousViewMode,
                snapshots,
                onDataLoaded,
                onNodeDataLoaded,
            }).then(async (dataLoadedResult) => {
                await nextState.sourceController?.setItemsAfterLoad(
                    items as RecordSet,
                    navigationSourceConfig,
                    nextState.keepNavigation
                );
                const resultState = {
                    ...dataLoadedResult,
                    items: nextState.sourceController?.getItems(),
                    hasMoreStorage: getHasMoreStorage(nextState),
                };

                const stateAfterUpdateItems = {
                    current: {},
                };

                await dispatch(
                    ListWebActions.source.resolveStateAfterUpdateItems({
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
    'currentState' | 'nextState' | 'previousViewMode' | 'snapshots'
> & {
    items: TLoadResult;
    direction: Direction | undefined;
    nextState: IListState;
    additionalPromise?: Promise<unknown>;
    key?: TKey;
    onDataLoaded?: TListSourceMiddlewareContext['onDataLoaded'];
    onNodeDataLoaded?: TListSourceMiddlewareContext['onNodeDataLoaded'];
};

async function dataLoadedSuccess({
    items,
    direction,
    currentState,
    nextState,
    additionalPromise,
    key,
    previousViewMode,
    snapshots,
    onDataLoaded,
    onNodeDataLoaded,
}: TDataLoadedInnerParams): Promise<Partial<IListState>> {
    const loadedPromises = [];

    const isNodeLoaded = key !== undefined && key !== nextState.root;
    let dataLoadResult;

    if (isNodeLoaded) {
        dataLoadResult = onNodeDataLoaded
            ? onNodeDataLoaded(items as RecordSet, key, direction, nextState)
            : nextState;
    } else {
        if (nextState.promiseResolverForReloadOnly) {
            nextState.promiseResolverForReloadOnly();
            delete nextState.promiseResolverForReloadOnly;
        }
        dataLoadResult = onDataLoaded
            ? onDataLoaded(items as RecordSet, direction, nextState)
            : nextState;
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

    const [preFinal] = await Promise.all(loadedPromises);

    if (!isLoaded('Controls/search') && !!preFinal.searchParam) {
        await loadAsync('Controls/search');
    }

    return {
        ...preFinal,
        ...getLoadResult({
            currentState,
            nextState: preFinal,
            items,
            snapshots,
            previousViewMode,
        }),
    };
}

type TGetLoadResultParams = {
    currentState: IListState;
    nextState: IListState;
    items: RecordSet;
    previousViewMode?: TMiddlewaresPropsForMigrationToDispatcher['sliceProperties']['previousViewMode'];
    snapshots: ISnapshotsStore;
};

function getLoadResult({
    currentState,
    nextState,
    items,
    previousViewMode,
    snapshots,
}: TGetLoadResultParams): Partial<IListState> {
    const sourceController = nextState.sourceController;
    const searchViewMode = resolveSearchViewMode(currentState.adaptiveSearchMode, previousViewMode);
    const searchValue = nextState.searchValue;
    const searchParam = nextState.searchParam;
    const expandedItemsChanged = !isEqual(nextState.expandedItems, currentState.expandedItems);
    const hasSearch = !!searchParam && searchValue;
    let viewMode;

    if (hasSearch) {
        viewMode = searchViewMode;
    } else if (searchParam) {
        viewMode = previousViewMode;
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
    const newRoot = sourceControllerState.root;
    let stateAfterUpdateItems = getStateAfterUpdateItems(currentState, nextState);
    if (newRoot !== currentState.root) {
        const breadCrumbs = calculateBreadcrumbsData(items, nextState.displayProperty);
        stateAfterUpdateItems = {
            ...stateAfterUpdateItems,
            ...breadCrumbs,
        };
    }

    const markedState: IListStateParts.IMarkerState = {};

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
        previousViewMode,
        errorViewConfig: undefined,
        expandedItems: sourceController?.getExpandedItems(),
        selectionViewMode: getSelectionViewMode(currentState, nextState),
        searchMisspellValue: hasSearch
            ? getSearchResolver().getSwitcherStrFromData(items || sourceController?.getItems())
            : '',
    } as Partial<IListState>;
}

function getRootItem(nextState: IListState): Model {
    const { markedKey, root, items, parentProperty } = nextState;

    const rootItem = items.getRecordById(markedKey as string);
    const parent = rootItem.get(parentProperty);
    const parentItem = items.getRecordById(parent);
    return parent === root || !parentItem
        ? rootItem
        : getRootItem({ ...nextState, markedKey: parentItem.getKey() });
}

function getRootNavSourceConfig(nextState: IListState): IBasePositionSourceConfig {
    const { navigation, parentProperty, markedKey, expandedItems, items } = nextState;
    const field = navigation.sourceConfig.field;
    const position = [];
    let item: Model;

    if (parentProperty) {
        item = getRootItem(nextState);
    } else {
        item = items.getRecordById(markedKey);
    }

    (field instanceof Array ? field : [field]).forEach((fieldName) => {
        position.push(item.get(fieldName));
    });

    const multiNavigation = !!expandedItems?.length;
    return {
        multiNavigation,
        position,
    };
}

function saveState(nextState: IListState): void {
    const {
        markedKey,
        selectedKeys,
        excludedKeys,
        searchValue,
        expandedItems,
        navigation,
        listConfigStoreId,
        sourceController,
        root,
        items,
    } = nextState;
    const state: IListSavedState = {
        selectedKeys,
        excludedKeys,
        searchValue,
        expandedItems,
        markedKey,
        root,
    };

    const hasItemWithMarkedKeyInItems = items.getRecordById(markedKey);

    if (
        navigation &&
        navigation.sourceConfig &&
        navigation.source === 'position' &&
        hasItemWithMarkedKeyInItems
    ) {
        const multiNavigation = !!expandedItems?.length;
        const rootSourceConfig = getRootNavSourceConfig(nextState);

        if (multiNavigation) {
            const navigationSourceConfig = new Map();
            navigationSourceConfig.set(nextState.root, rootSourceConfig);

            expandedItems?.forEach((key) => {
                navigationSourceConfig.set(key, {
                    position: null,
                    limit:
                        sourceController?.getItemsCountForRoot(key) ||
                        navigation.sourceConfig.limit,
                    multiNavigation,
                });
            });
            state.navigationSourceConfig = navigationSourceConfig;
            state.navigationSourceConfig.multiNavigation = true;
        } else {
            state.navigationSourceConfig = rootSourceConfig;
        }
    }

    saveControllerState(listConfigStoreId as string, state);
}
