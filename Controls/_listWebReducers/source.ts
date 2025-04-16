/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMiddleware, IListState, TListMiddlewareContext } from 'Controls-DataEnv/list';
import type { TViewMode } from 'Controls-DataEnv/interface';
import type {
    IIgnoreNavigationConfig,
    INavigationPageSourceConfig,
    INavigationPositionSourceConfig,
    INavigationSourceConfig,
    TPositionField,
    TSortingOptionValue,
} from 'Controls-DataEnv/listTypes';
import type {
    IBaseSourceConfig,
    IBasePositionSourceConfig,
    Direction,
    TKey,
} from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { Model, PromiseCanceledError } from 'Types/entity';
import type { CrudEntityKey } from 'Types/source';
import type { CanceledError } from 'ErrorHandling/interface';

import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';
import { ListWebInitializers, ListWebActions, _private } from 'Controls/dataFactory';
import {
    SnapshotName,
    ISnapshotsStore,
    TListActions,
    ListActionCreators,
} from 'Controls-DataEnv/list';

import { type IListSavedState, saveControllerState } from 'Controls/dataSource';

import { isEqual } from 'Types/object';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { calculateBreadcrumbsData } from 'Controls/dataSource';
import { resolveSearchViewMode, getSelectionViewMode } from './utils';

const { getActiveElementByItems } = _private;
const { getDecomposedPromise } = _private_DecomposedPromise;

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

interface IListStateForSource extends IListState {
    _loadItemsToDirectionPromiseResolver?: Function;
    promiseResolverForReloadOnly?: Function;
}

export const source: TListMiddleware<IListStateForSource> = (ctx: TListSourceMiddlewareContext) => {
    const {
        getState,
        originalSliceGetState,
        setState,
        applyState,
        dispatch,
        getCollection,
        getTrashBox,
        snapshots,
        scheduleDispatch,
        onDataLoaded,
        onNodeDataLoaded,
        registerPendingPromise,
    } = ctx;
    let needReload = false;
    let loadParams: { sourceConfig?: IBaseSourceConfig } = {};

    const applyLoading = async (state: boolean) =>
        applyState({
            loading: state,
        });

    function createNewLoadAction(
        direction: 'up' | 'down',
        addItemsAfterLoad?: boolean,
        useServicePool?: boolean,
        onResolve?: Function,
        onReject?: Function
    ) {
        return ListActionCreators.source.loadToDirection({
            retryAction: () => {
                scheduleDispatch(
                    createNewLoadAction(
                        direction,
                        addItemsAfterLoad,
                        useServicePool,
                        onResolve,
                        onReject
                    )
                );
            },
            direction,
            addItemsAfterLoad,
            onResolve,
            onReject,
        });
    }

    const getTrashProps = () => getTrashBox()._propsForMigrationToDispatcher;

    const getSafeDecomposedPromise = <T>(
        key: string,
        strategy: 'throwError' | 'replace' = 'throwError'
    ): _private_DecomposedPromise.TDecomposedPromise<T> => {
        const dP = getDecomposedPromise<T>();

        const promise = registerPendingPromise(key, dP.promise, strategy);

        return { ...dP, promise };
    };

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

                const dLoaded = getSafeDecomposedPromise<Partial<IListState>>('dDataLoaded');

                await dispatch(
                    ListWebActions.source.dataLoadedSuccess({
                        items: newItems as RecordSet,
                        direction,
                        nextState,
                        additionalPromise,
                        currentState,

                        onResolve: dLoaded.resolve,
                        onReject: dLoaded.reject,
                    })
                );

                const newState = await dLoaded.promise;

                await nextState.sourceController?.setItemsAfterLoad(
                    newItems,
                    // FIXME: Рассинхронизация типов в sourceController. По типам он не может принимать IIgnoreNavigationConfig, но в то же время учитывает его при работе
                    // @ts-expect-error fixme
                    sourceConfig,
                    keepNavigation,
                    direction
                );

                if (isExtendedState(nextState) && nextState._loadItemsToDirectionPromiseResolver) {
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

                const navigation = getState().navigation;

                if (
                    !sourceConfig &&
                    keepNavigation &&
                    navigation?.sourceConfig &&
                    !isIgnoreNavigationConfig(navigation.sourceConfig)
                ) {
                    const isMultiNavigation = !!navigation.sourceConfig.multiNavigation;

                    if (
                        !isMultiNavigation &&
                        navigation?.source === 'page' &&
                        isNavigationPageSourceConfig(navigation.sourceConfig)
                    ) {
                        const navPageSize = navigation.sourceConfig.pageSize;
                        const itemsCount = getCollection()
                            ? getCollection()?.getSourceCollectionCount()
                            : getState().sourceController?.getItems?.()?.getCount?.();
                        const pageSize = Math.max(
                            Math.ceil((itemsCount ?? 0) / navPageSize) * navPageSize,
                            navPageSize
                        );
                        sourceConfig = {
                            ...navigation.sourceConfig,
                            page: 0,
                            pageSize,
                        };
                    }
                }

                const trashProps = getTrashProps();

                if (trashProps?.sliceProperties) {
                    trashProps.sliceProperties.loadConfig = {
                        sourceConfig,
                        keepNavigation,
                    };
                }

                await dispatch(
                    ListWebActions.source.reloadOnSourceController({
                        sourceController,
                        sourceConfig,
                        addItemsAfterLoad: false,
                        keepNavigation,

                        onResolve: (items: RecordSet) => {
                            scheduleDispatch(
                                ListWebActions.source.newItemsReceived({
                                    items,
                                    loadConfig: {
                                        ...(trashProps?.sliceProperties?.loadConfig ?? {}),
                                    },
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
                        onReject: (error: Error) => {
                            if (error && !(error as CanceledError).isCanceled) {
                                scheduleDispatch(ListWebActions.error.handleLoadError(error));
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
                    isDefaultError = true,
                } = action.payload;

                if (!state.sourceController) {
                    onReject?.(ERROR_DESCRIPTORS.SOURCE_CONTROLLER_IS_UNDEFINED());
                    break;
                }

                registerPendingPromise(
                    `loadOnSourceController ${key || ''}`,
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
                    .catch(async (error) => {
                        if (addItemsAfterLoad === false) {
                            state.sourceController?.setLoadError(error, key, direction);
                        }
                        if (!(error as PromiseCanceledError).isCanceled && isDefaultError) {
                            scheduleDispatch(
                                ListWebActions.error.handleLoadError(error, direction, key)
                            );
                        }
                        return onReject?.(error);
                    })
                    .finally(() => {
                        scheduleDispatch(
                            ListWebActions.interactorCore.publicSetState({ loading: false })
                        );
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
                    'reloadOnSourceController',
                    sourceController.reload(
                        // FIXME: Рассинхронизация типов в sourceController. По типам он не может принимать IIgnoreNavigationConfig, но в то же время учитывает его при работе
                        // @ts-expect-error fixme
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
                        if (addItemsAfterLoad === false) {
                            sourceController.setLoadError(e, getState().root);
                        }
                        onReject?.(e);
                    })
                    .finally(() => {
                        scheduleDispatch(
                            ListWebActions.interactorCore.publicSetState({ loading: false })
                        );
                    });

                break;
            }

            case 'updateHasMoreStorage': {
                setState({
                    hasMoreStorage:
                        action.payload.hasMoreStorage ??
                        getHasMoreStorage(action.payload.nextState),
                });
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

                    const dOldLoad = getSafeDecomposedPromise<void>(`nodeLoadPromise: ${key}`);

                    await dispatch(
                        ListWebActions.source.oldSliceLoad({
                            state: nextState,
                            key,
                            disableSetState: true,
                            onResolve: dOldLoad.resolve,
                            onReject: dOldLoad.reject,
                        })
                    );

                    nodeLoadersPromises.push(dOldLoad.promise);
                }

                if (!nodeLoadersPromises.length) {
                    const newNextState = {
                        ...nextState,
                        hasMoreStorage: getHasMoreStorage(nextState),
                    };
                    await dispatch(
                        ListWebActions.complexUpdate.complexUpdateItems(currentState, newNextState)
                    );

                    onResolve?.(newNextState);
                } else {
                    const propsForMigration = getTrashProps();
                    if (!propsForMigration?.sliceCallbacks.isDestroyed()) {
                        registerPendingPromise('loadNodes', Promise.all(nodeLoadersPromises))
                            // Ждем успешной загрузки всех узлов, формируем новый стейт
                            .then(() => {
                                const newNextState = {
                                    ...nextState,
                                    hasMoreStorage: getHasMoreStorage(nextState),
                                };

                                return dispatch(
                                    ListWebActions.complexUpdate.complexUpdateItems(
                                        currentState,
                                        newNextState
                                    )
                                ).then(() => newNextState);
                            })
                            // Формируем новый стейт, даже если была ошибка.
                            // В таком случае мы все равно должны завершиться успешно,
                            // т.к. ошибка будет обработана дружелюбно.
                            .catch(() => {
                                return {
                                    expandedItems: currentState.expandedItems,
                                };
                            })
                            // Уведомляем о завершении
                            .then((result) => {
                                onResolve?.(result);
                            });
                    }
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
                if (
                    originalSliceGetState().searchValue !== getState().searchValue &&
                    originalSliceGetState().root === getState().root
                ) {
                    break;
                }
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
                    await reloadFromBAS({
                        nextState: getState(),
                        currentState: originalSliceGetState(),
                        navigationSourceConfig: loadParams.sourceConfig,
                        viewModePromise: snapshotBeforeComplexUpdate?.additionalPromise,
                        props,
                        snapshots,
                        dispatch,
                        onDataLoaded,
                        onNodeDataLoaded,
                        registerPendingPromise,
                    })
                        .then((newState) => {
                            setState(newState);
                        })
                        .catch(async (error) => {
                            await dispatch(ListWebActions.error.handleLoadError(error));
                        });
                }
                break;
            }
            case 'initSource': {
                const trashProps = getTrashProps();

                setState({
                    sourceController:
                        trashProps?.sliceProperties?.sourceController ||
                        createSourceController(getState()),
                });

                if (trashProps?.sliceProperties) {
                    trashProps.sliceProperties.sourceController = getState().sourceController;
                }
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
                    isDefaultError,
                } = action.payload;
                const propsForMigration = getTrashProps();
                if (propsForMigration?.sliceCallbacks.isDestroyed()) {
                    break;
                }

                const dLoad = getSafeDecomposedPromise<TLoadResult>(
                    `dLoadOnSourceController ${key || ''}`
                );

                await dispatch(
                    ListWebActions.source.loadOnSourceController({
                        state,
                        direction,
                        key,
                        filter,
                        addItemsAfterLoad,
                        navigationSourceConfig,
                        onResolve: dLoad.resolve,
                        onReject: dLoad.reject,
                        isDefaultError,
                    })
                );

                const onThenCallback = async (result: TLoadResult) => {
                    const propsForMigration = getTrashProps();

                    if (propsForMigration?.sliceCallbacks.isDestroyed() || !addItemsAfterLoad) {
                        onResolve?.(result);
                        return;
                    }

                    const nextState = state || originalSliceGetState();

                    return registerPendingPromise(
                        'oldSliceLoad/onThenCallback',
                        dataLoadedSuccess({
                            items: result as RecordSet,
                            direction,
                            nextState: {
                                ...nextState,
                                loading: false,
                                filter: filter || nextState.filter,
                            },
                            key,
                            currentState: originalSliceGetState(),
                            previousViewMode: propsForMigration?.sliceProperties?.previousViewMode,
                            snapshots,
                            onDataLoaded,
                            onNodeDataLoaded,
                        })
                    ).then((newState) => {
                        if (!disableSetState) {
                            if (filter) {
                                newState.sourceController?.setFilter(filter);
                            }
                            // Используется setState с функцией, чтобы обойти проверку на needReject
                            // Использование объекта приводит к тому, что еще не завершившийся экшен загрузки
                            // отменяется пришедшим состоянием
                            // Поправить по ошибке: https://online.sbis.ru/opendoc.html?guid=ac9acd58-5184-49da-a439-8ee8dbc41183&client=3
                            scheduleDispatch(
                                ListWebActions.interactorCore.publicSetState(() => newState)
                            );
                        }
                        onResolve?.(result);
                    });
                };

                const onCatchCallback = async (error: unknown) => {
                    if (propsForMigration?.sliceCallbacks.isDestroyed()) {
                        onReject?.(error);
                        return;
                    }
                    // TODO: !!!!!!
                    await applyLoading(false);

                    if (needProcessError(error) && filter) {
                        const nextState = state || originalSliceGetState();
                        nextState.sourceController?.setFilter(filter);
                    }

                    onReject?.(error);
                };

                if (awaitLoad) {
                    try {
                        const result = await dLoad.promise;
                        await onThenCallback(result);
                    } catch (e) {
                        await onCatchCallback(e);
                    }
                } else {
                    dLoad.promise.then(onThenCallback).catch(onCatchCallback);
                }

                break;
            }

            case 'resolveStateAfterUpdateItems': {
                const { currentState, nextState = currentState, resultRef } = action.payload;
                resultRef.current = getStateAfterUpdateItems(currentState, {
                    ...currentState,
                    ...nextState,
                });
                break;
            }

            case 'loadToDirection': {
                await applyLoading(true);

                const {
                    direction,
                    useServicePool,
                    addItemsAfterLoad = true,
                    onResolve,
                    onReject,
                } = action.payload;
                const propsForMigration = getTrashProps();
                if (propsForMigration?.sliceCallbacks.isDestroyed()) {
                    break;
                }

                const dLoad = getSafeDecomposedPromise<TLoadResult>('dLoadOnSourceController');

                await dispatch(
                    ListWebActions.source.loadOnSourceController({
                        direction,
                        addItemsAfterLoad: false,
                        useServicePool,
                        onResolve: dLoad.resolve,
                        onReject: dLoad.reject,
                        isDefaultError: false,
                    })
                );

                const onThenCallback = async (items: TLoadResult) => {
                    if (items instanceof Error) {
                        onReject?.(items);
                        return;
                    }

                    if (propsForMigration?.sliceCallbacks.isDestroyed() || !addItemsAfterLoad) {
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

                    return registerPendingPromise('onThenCallback', setStatePromise.promise).then(
                        () => {
                            onResolve?.(items);
                        }
                    );
                };

                const onCatchCallback = async (error: unknown) => {
                    if (needProcessError(error)) {
                        const retryAction = () => {
                            scheduleDispatch(
                                ListWebActions.interactorCore.publicSetState({
                                    errorViewConfig: undefined,
                                })
                            );
                            action.payload.retryAction?.();
                        };
                        scheduleDispatch(
                            ListWebActions.error.handleLoadError(
                                error as Error,
                                direction,
                                originalSliceGetState().root,
                                retryAction
                            )
                        );
                    }
                    onReject?.(error);
                };

                if (!propsForMigration?.sliceCallbacks.isDestroyed()) {
                    dLoad.promise.then(onThenCallback).catch(onCatchCallback);
                }

                break;
            }

            case 'setPreloadedItems': {
                const trashProps = getTrashProps();

                const { items, direction, onResolve } = action.payload;

                if (trashProps?.sliceProperties) {
                    trashProps.sliceProperties.newItems = items;
                    trashProps.sliceProperties.newItemsDirection = direction;
                }

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
                    'dataLoadedSuccess',
                    dataLoadedSuccess({
                        items,
                        direction,
                        nextState,
                        additionalPromise,
                        key,
                        currentState,
                        previousViewMode: props?.sliceProperties?.previousViewMode,
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

            case 'loadPrev': {
                await dispatch(
                    createNewLoadAction(
                        'up',
                        action.payload.addItemsAfterLoad,
                        action.payload.useServicePool,
                        action.payload.onResolve,
                        action.payload.onReject
                    )
                );
                break;
            }

            case 'loadNext': {
                await dispatch(
                    createNewLoadAction(
                        'down',
                        action.payload.addItemsAfterLoad,
                        action.payload.useServicePool,
                        action.payload.onResolve,
                        action.payload.onReject
                    )
                );
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
                const propsForMigration = getTrashProps();

                const { key, options, onResolve, onReject } = action.payload;

                const itemLoad = getDecomposedPromise<RecordSet | Model>();
                const addItemsAfterLoad = !options?.hierarchyReload;
                if (propsForMigration?.sliceCallbacks.isDestroyed() || !items) {
                    break;
                }
                registerPendingPromise(
                    'reloadItem',
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
                const onThenCallback = (items: RecordSet | Model) => {
                    if (!propsForMigration?.sliceCallbacks.isDestroyed() && !addItemsAfterLoad) {
                        const setStatePromise = getDecomposedPromise();

                        scheduleDispatch(
                            ListWebActions.source.setPreloadedItems({
                                items: items as RecordSet,
                                direction: undefined,
                                onResolve: setStatePromise.resolve,
                                onReject: setStatePromise.reject,
                            })
                        );

                        return registerPendingPromise(
                            'onThenCallback',
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
                registerPendingPromise('reloadItem:itemLoad', itemLoad.promise)
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

                if (!items) {
                    break;
                }

                const { keys, onResolve, onReject } = action.payload;

                registerPendingPromise(
                    'reloadItems',
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

            case 'rejectLoad': {
                //# region Обновление состояния
                const sourceController = getState().sourceController;
                if (sourceController && sourceController.isLoading()) {
                    sourceController.cancelLoading();
                    sourceController.updateOptions(
                        getSourceControllerOptions(originalSliceGetState())
                    );
                }
                //# endregion
                break;
            }

            case 'onEndUpdate': {
                await dispatch(ListWebActions.source.updateSavedState());
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
    registerPendingPromise,
}: {
    currentState: IListState;
    nextState: IListState;
    navigationSourceConfig?: IBaseSourceConfig;
    viewModePromise?: Promise<Partial<IListState>>;
    snapshots: ISnapshotsStore;
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher | null;
    dispatch: Function;
    onDataLoaded?: TListSourceMiddlewareContext['onDataLoaded'];
    onNodeDataLoaded?: TListSourceMiddlewareContext['onNodeDataLoaded'];
    registerPendingPromise: Function;
}) {
    if (props?.sliceCallbacks.isDestroyed()) {
        return;
    }
    const dReload = getDecomposedPromise<TLoadResult>();
    const dReloadPromise = registerPendingPromise('dReloadOnSourceController', dReload.promise);

    const sourceController = (nextState || currentState).sourceController;

    if (sourceController) {
        await dispatch(
            ListWebActions.source.reloadOnSourceController({
                sourceController,
                sourceConfig: navigationSourceConfig,
                keepNavigation: nextState.keepNavigation,
                addItemsAfterLoad: false,
                onResolve: dReload.resolve,
                onReject: dReload.reject,
            })
        );
    }

    return dReloadPromise.then((items: TLoadResult) => {
        const newState = { ...nextState };
        return dataLoadedSuccess({
            items: items as RecordSet,
            direction: undefined,
            nextState: newState,
            additionalPromise: viewModePromise,
            key: undefined,
            currentState,
            previousViewMode: props?.sliceProperties?.previousViewMode,
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
    });
}

function getStateAfterUpdateItems(currentState: IListState, nextState: IListState = currentState) {
    const sourceControllerState = nextState.sourceController?.getState();
    const newHasMoreStorage = getHasMoreStorage(nextState);

    return {
        selectionViewMode: getSelectionViewMode(currentState, nextState),
        items: sourceControllerState?.items,
        activeElement: calcActiveElementAfterUpdateItems(currentState, nextState),
        breadCrumbsItems: sourceControllerState?.breadCrumbsItems,
        breadCrumbsItemsWithoutBackButton: sourceControllerState?.breadCrumbsItemsWithoutBackButton,
        backButtonCaption: sourceControllerState?.backButtonCaption,
        hasMoreStorage: isEqual(currentState.hasMoreStorage, newHasMoreStorage)
            ? currentState.hasMoreStorage
            : newHasMoreStorage,
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
    'currentState' | 'previousViewMode' | 'snapshots'
> & {
    items: RecordSet;
    direction: Direction | undefined;
    nextState: Partial<IListState>;
    additionalPromise?: Promise<Partial<IListState>>;
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
    const loadedPromises: Promise<Partial<IListState>>[] = [];

    const isNodeLoaded = key !== undefined && key !== nextState.root;
    let dataLoadResult;

    if (isNodeLoaded) {
        nextState.hasMoreStorage = getHasMoreStorage({
            expandedItems: nextState.expandedItems ?? [],
            sourceController: nextState.sourceController,
        });
    }

    if (!isLoaded('Controls/search') && nextState.searchParam) {
        await loadAsync('Controls/search');
    }

    const next = {
        ...nextState,
        ...getLoadResult({
            currentState,
            nextState,
            items,
            snapshots,
            previousViewMode,
            direction,
        }),
    };

    if (isNodeLoaded) {
        dataLoadResult = onNodeDataLoaded
            ? // FIXME: непонятно, что делать с direction. Он неопциональный, но нигде не используется
              // @ts-expect-error см. коммент выше
              onNodeDataLoaded(items as RecordSet, key, direction, next)
            : next;
    } else {
        if (isExtendedState(next) && next.promiseResolverForReloadOnly) {
            next.promiseResolverForReloadOnly();
            delete next.promiseResolverForReloadOnly;
        }
        // FIXME: непонятно, что делать с direction. Он неопциональный, но нигде не используется
        // @ts-expect-error см. коммент выше
        dataLoadResult = onDataLoaded ? onDataLoaded(items as RecordSet, direction, next) : next;
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

    const [final] = await Promise.all(loadedPromises);

    return final;
}

type TGetLoadResultParams = {
    currentState: IListState;
    nextState: Partial<IListState>;
    items: RecordSet;
    previousViewMode?: TViewMode;
    snapshots: ISnapshotsStore;
    direction?: Direction;
};

function getLoadResult({
    currentState,
    nextState,
    items,
    previousViewMode,
    snapshots,
    direction,
}: TGetLoadResultParams): Partial<IListState> {
    const sourceController = nextState.sourceController;
    const searchViewMode = previousViewMode
        ? resolveSearchViewMode(!!currentState.adaptiveSearchMode, previousViewMode)
        : 'search';
    const searchValue = nextState.searchValue;
    const searchParam = nextState.searchParam;
    const expandedItemsChanged = !isEqual(nextState.expandedItems, currentState.expandedItems);
    const hasSearch = !!searchParam && searchValue;
    let viewMode;

    if (hasSearch) {
        viewMode = searchViewMode;
    } else if (
        searchParam &&
        currentState.searchValue &&
        !nextState.searchValue &&
        currentState.viewMode === nextState.viewMode
    ) {
        viewMode = previousViewMode;
    } else {
        viewMode = nextState.viewMode;
    }

    let stateAfterUpdateItems: Partial<IListState> = {};

    if (sourceController) {
        if (typeof nextState.root !== 'undefined') {
            sourceController.setRoot(nextState.root);
        }

        if (hasSearch && nextState.filter) {
            sourceController.setFilter(nextState.filter);
        }

        if (expandedItemsChanged) {
            sourceController.setExpandedItems(nextState.expandedItems ?? []);
        }
    }

    const sourceControllerState = sourceController?.getState();
    const newRoot: TKey | undefined = sourceControllerState?.root;

    stateAfterUpdateItems = getStateAfterUpdateItems(currentState, {
        ...nextState,
        ...currentState,
    });

    if (newRoot !== currentState.root) {
        const breadCrumbs = calculateBreadcrumbsData(items, nextState.displayProperty);
        stateAfterUpdateItems = {
            ...stateAfterUpdateItems,
            ...breadCrumbs,
        };
    }

    if (sourceController && searchParam && nextState.filter) {
        let newFilter = sourceController.getFilter();
        const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);
        if (searchValue) {
            const {
                filter,
                parentProperty,
                searchStartingWith,
                root,
                breadCrumbsItems,
                deepReload,
                expandedItems,
            } = nextState;
            newFilter = getSearchResolver().getFilterForSearch(
                {
                    filter,
                    searchParam,
                    parentProperty,
                    searchStartingWith,
                    root: root as CrudEntityKey,
                    breadCrumbsItems,
                    deepReload,
                    sourceController,
                    expandedItems: expandedItems as CrudEntityKey[],
                },
                nextState.searchValue ?? '',
                beforeSearchSnapshot?.root as CrudEntityKey | undefined
            );
        } else if (currentState.searchParam) {
            newFilter = getSearchResolver().getResetSearchFilter(
                nextState.filter,
                searchParam,
                nextState.parentProperty ?? '',
                !beforeSearchSnapshot?.hasHierarchyFilter,
                !beforeSearchSnapshot?.hasRootInFilter
            );
        }

        sourceController.setFilter(newFilter);
    }

    let searchMisspellValue = '';

    if (hasSearch) {
        if (direction) {
            searchMisspellValue = nextState.searchMisspellValue || '';
        } else {
            searchMisspellValue = getSearchResolver().getSwitcherStrFromData(
                items || sourceController?.getItems()
            );
        }
    }

    if (!stateAfterUpdateItems.items) {
        stateAfterUpdateItems.items = sourceControllerState?.items;
    }

    return {
        loading: false,
        ...stateAfterUpdateItems,
        filter: sourceController?.getFilter(),
        root: newRoot,
        sorting: sourceControllerState?.sorting as TSortingOptionValue | undefined,
        viewMode,
        previousViewMode,
        errorViewConfig: undefined,
        expandedItems: sourceController?.getExpandedItems(),
        selectionViewMode: getSelectionViewMode(currentState, { ...currentState, ...nextState }),
        searchMisspellValue,
    };
}

function getRootItem(nextState: IListState): Model | undefined {
    const { markedKey, root, items, parentProperty } = nextState;

    const rootItem = items?.getRecordById(markedKey as string);
    const parent =
        typeof parentProperty !== 'undefined' ? rootItem?.get(parentProperty) : undefined;
    const parentItem = items?.getRecordById(parent);
    return parent === root || !parentItem
        ? rootItem
        : getRootItem({ ...nextState, markedKey: parentItem.getKey() });
}

function getRootNavSourceConfig(nextState: IListState): IBasePositionSourceConfig {
    const { navigation, parentProperty, markedKey, expandedItems, items } = nextState;
    const field =
        navigation?.sourceConfig && isNavigationPositionSourceConfig(navigation.sourceConfig)
            ? navigation.sourceConfig.field
            : [];
    const position: TPositionField = [];
    let item: Model | undefined;

    if (parentProperty) {
        item = getRootItem(nextState);
    } else if (markedKey) {
        item = items?.getRecordById(markedKey);
    }

    (field instanceof Array ? field : [field]).forEach((fieldName) => {
        const itemPosition = item?.get(fieldName);

        if (position) {
            position.push(itemPosition);
        }
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
        count,
    } = nextState;
    const state: IListSavedState = {
        selectedKeys,
        excludedKeys,
        searchValue,
        expandedItems,
        markedKey,
        root,
        count,
    };

    const hasItemWithMarkedKeyInItems = markedKey && items?.getRecordById(markedKey);

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
            const { sourceConfig } = navigation;
            navigationSourceConfig.set(nextState.root, rootSourceConfig);

            expandedItems?.forEach((key) => {
                navigationSourceConfig.set(key, {
                    position: null,
                    limit: getLimitByKey(key as CrudEntityKey, sourceConfig, sourceController),
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

function getLimitByKey(
    key: CrudEntityKey,
    sourceConfig: INavigationSourceConfig,
    sourceController?: IListState['sourceController']
): number | undefined {
    const limit: number | undefined = sourceController?.getItemsCountForRoot(key);

    if (!limit && isNavigationPositionSourceConfig(sourceConfig)) {
        return sourceConfig.limit;
    }

    return limit;
}

function isExtendedState(state: Partial<IListState>): state is IListStateForSource {
    return (
        !!(state as IListStateForSource)._loadItemsToDirectionPromiseResolver ||
        !!(state as IListStateForSource).promiseResolverForReloadOnly
    );
}

function isIgnoreNavigationConfig(
    sourceConfig: INavigationSourceConfig
): sourceConfig is IIgnoreNavigationConfig {
    return (sourceConfig as IIgnoreNavigationConfig).ignoreNavigation;
}

function isNavigationPageSourceConfig(
    sourceConfig: INavigationSourceConfig
): sourceConfig is INavigationPageSourceConfig {
    return !!(sourceConfig as INavigationPageSourceConfig).pageSize;
}

function isNavigationPositionSourceConfig(
    sourceConfig: INavigationSourceConfig
): sourceConfig is INavigationPositionSourceConfig {
    return !!(sourceConfig as INavigationPositionSourceConfig).field;
}
