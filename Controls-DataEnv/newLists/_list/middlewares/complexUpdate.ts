/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isEqual } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { USER } from 'ParametersWebAPI/Scope';
import type { Collection as ICollection } from 'Controls/display';

import { TListMiddleware } from '../types/TListMiddleware';
import { SnapshotName } from '../types/SnapshotName';
import { ListActionCreators } from '../actions/creators';
import { IListState } from '../interface/IListState';
import { TMiddlewaresPropsForMigrationToDispatcher } from '../actions/types/complexUpdate';
import { createSourceController, getSourceControllerOptions } from '../ListWebInitializer/source';
import {
    getCountConfig,
    getListCommandsSelection,
    getSelectionViewMode,
    getStateForOnlySelectedItems,
    loadCount,
} from './operationsPanel';
import { resolveSearchViewMode } from '../loadData/resolveSearchViewMode';
import {
    _private_DecomposedPromise,
    getError,
    TAbstractListMiddlewareContext,
} from 'Controls-DataEnv/abstractList';
import { isLoaded } from 'WasabyLoader/ModulesLoader';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с комплексным обновлением состояния(публичный setState)
 */
export const complexUpdate: TListMiddleware =
    ({
        dispatch,
        getState,
        setState,
        applyState,
        getCollection,
        snapshots,
        originalSliceGetState,
        getTrashBox,
        registerPendingPromise,
        scheduleDispatch,
    }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'onBeforeStartUpdate': {
                snapshots.set(SnapshotName.ComplexUpdate, {
                    isReducingState: true,
                });
                // slice._collection может обновиться во время цикла обновления через applyState. Это приведет к рассинхрону
                // между локальным состоянием коллекции в диспатчере и на слайсе. Поэтому перед расчетами необходимо локально
                // актуализировать коллекцию.
                // убрать по задаче: https://online.sbis.ru/opendoc.html?guid=5dedb2f7-39e1-49b7-ba95-5b5f19974974&client=3
                if (getState().collection !== getCollection()) {
                    setState({
                        collection: getCollection(),
                    });
                }
                break;
            }
            case 'onAfterStartUpdate': {
                const { prevState } = action.payload;
                // #region Обновление состояния
                // @ts-ignore
                setState(getCompatibleNextState(prevState, prevState, getState()));

                // #endregion Обновление состояния

                snapshots.delete(SnapshotName.ComplexUpdate);
                break;
            }
            case 'onAfterBeforeApplyState': {
                const { prevState } = action.payload;
                snapshots.set(SnapshotName.ComplexUpdate, {
                    isReducingState: true,
                    isBeforeApplyState: true,
                });
                // #region Обновление состояния
                await dispatch(ListActionCreators.complexUpdate.reduceState(prevState, getState()));

                // необходимо разнести всю логику из oldBeforeApplyState и этот экшен удалится
                await dispatch(
                    ListActionCreators.complexUpdate.oldBeforeApplyState(prevState, getState())
                );

                if (isLoaded('Controls/listWebReducers')) {
                    await dispatch(ListActionCreators.source.awaitAllRequests());
                }

                const newItems = getState().items;
                if (
                    getState().fix88221034174482 &&
                    prevState.items &&
                    newItems &&
                    prevState.items !== newItems
                ) {
                    const { _propsForMigrationToDispatcher } = getTrashBox();
                    await dispatch(ListActionCreators.items.replaceAllItems(newItems));
                    _propsForMigrationToDispatcher?.sliceCallbacks?.updateSubscriptionOnItems?.(
                        prevState.items,
                        newItems
                    );
                }
                snapshots.delete(SnapshotName.ComplexUpdate);
                // #endregion Обновление состояния
                break;
            }
            case 'oldBeforeApplyState': {
                const compatibleState = getCompatibleNextState(
                    action.payload.prevState,
                    action.payload.nextState,
                    getState()
                );
                const { _propsForMigrationToDispatcher } = getTrashBox();
                // Старый код.
                // Мы уже что-то обновили выше.
                // В старый код нужно отдать предыдущий стейт, а в новый уже посчитанный.
                const nextState = await beforeApplyState_fn(
                    action.payload.prevState,
                    compatibleState,
                    _propsForMigrationToDispatcher,
                    getCollection(),
                    snapshots,
                    dispatch,
                    registerPendingPromise,
                    scheduleDispatch
                );
                if (nextState.expandedItems !== getState().expandedItems) {
                    await dispatch(
                        ListActionCreators.expandCollapse.setExpandedItems(
                            nextState.expandedItems,
                            true
                        )
                    );
                    nextState.expansionModel = getState().expansionModel;
                }
                setState(nextState);
                break;
            }
            // TODO: добавить EndUpdate

            case 'onPublicSetState': {
                const { partialNextState } = action.payload;
                snapshots.set(SnapshotName.ComplexUpdate, {
                    ...(snapshots.get(SnapshotName.ComplexUpdate) || {}),
                    isPublicSetState: true,
                });

                //# region Обновление состояния
                await dispatch(
                    ListActionCreators.complexUpdate.reduceState(getState(), {
                        ...getState(),
                        ...partialNextState,
                    })
                );
                // #endregion
                snapshots.set(SnapshotName.ComplexUpdate, {
                    ...(snapshots.get(SnapshotName.ComplexUpdate) || {}),
                    isPublicSetState: false,
                });
                break;
            }
            case 'reduceState': {
                const { nextState, prevState } = action.payload;
                // #region Обновление состояния

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateOperationsPanel(
                        prevState,
                        nextState
                    )
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateSelection(prevState, nextState)
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateItems(prevState, nextState)
                );
                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateItemActions(prevState, nextState)
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateExpandCollapse(
                        prevState,
                        nextState
                    )
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateMarker(prevState, nextState)
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateSearch(prevState, nextState)
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateFilter(prevState, nextState)
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateRoot(prevState, nextState)
                );

                await dispatch(
                    ListActionCreators.complexUpdate.complexUpdateSource(prevState, nextState)
                );

                setState(getCompatibleNextState(originalSliceGetState(), nextState, getState()));

                break;
            }
            case 'complexUpdateSource': {
                const { prevState, nextState } = action.payload;
                const sliceProperties =
                    getTrashBox()._propsForMigrationToDispatcher?.sliceProperties;

                if (sliceProperties && prevState.sourceController !== nextState.sourceController) {
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
            case 'complexUpdateOperationsPanel': {
                const { prevState, nextState } = action.payload;

                const operationsPanelVisibleChanged =
                    prevState.operationsPanelVisible !== nextState.operationsPanelVisible;

                // TODO: Это не должно быть тут.
                //  Унести в selection, которая обновит снапшот и стейт.
                if (
                    prevState.multiSelectVisibility !== nextState.multiSelectVisibility &&
                    !snapshots.get(SnapshotName.BeforeOpenOperationsPanel)?.multiSelectVisibility &&
                    // обновление снэпшота должна происходить только после прикладника
                    snapshots.get(SnapshotName.ComplexUpdate)?.isBeforeApplyState
                ) {
                    snapshots.set(SnapshotName.BeforeOpenOperationsPanel, {
                        multiSelectVisibility: nextState.multiSelectVisibility,
                    });
                }

                if (!operationsPanelVisibleChanged) {
                    break;
                }

                if (nextState.operationsPanelVisible) {
                    await dispatch(ListActionCreators.operationsPanel.openOperationsPanel());
                } else {
                    await dispatch(ListActionCreators.operationsPanel.closeOperationsPanel());
                }

                break;
            }
            case 'complexUpdateMarker': {
                const { prevState, nextState } = action.payload;

                if (prevState.markerVisibility !== nextState.markerVisibility) {
                    // Не скрываем маркер, если открыто ПМО и прикладной разработчик
                    // пытается скрыть маркер.
                    const shouldIgnoreVisibilityChange =
                        nextState.operationsPanelVisible && nextState.markerVisibility === 'hidden';

                    // Если идет смена модели с поддерживаемой на неподдерживаемую,
                    // то в некоторых случаях не нужно проставлять маркер.
                    // Например, если маркер прикладным разработчиком не задан.
                    // У нас нет точек в слайсе, чтобы понять, задан ли маркер и нет точки,
                    // чтобы понять, какая модель будет следующая.
                    // Ошибка https://online.sbis.ru/opendoc.html?guid=883d4c50-ea09-41fb-8ba0-84178b820f6b&client=3
                    // Чтобы таких ошибок не было, нужно поддержать все модели.
                    // Задача https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
                    const isNextModelSupported = nextState.fix1193265616 !== true;

                    if (isNextModelSupported && !shouldIgnoreVisibilityChange) {
                        await dispatch(
                            ListActionCreators.marker.setMarkerVisibility(
                                nextState.markerVisibility
                            )
                        );
                    }
                }

                if (prevState.markedKey !== nextState.markedKey) {
                    await dispatch(ListActionCreators.marker.mark(nextState.markedKey));
                }

                break;
            }
            case 'complexUpdateSelection': {
                const {
                    prevState: { selectedKeys: prevSelectedKeys, excludedKeys: prevExcludedKeys },
                    nextState: { selectedKeys: nextSelectedKeys, excludedKeys: nextExcludedKeys },
                } = action.payload;

                if (
                    isEqual(prevSelectedKeys, nextSelectedKeys) &&
                    isEqual(prevExcludedKeys, nextExcludedKeys)
                ) {
                    break;
                }

                await dispatch(
                    ListActionCreators.selection.setSelection(nextSelectedKeys, nextExcludedKeys)
                );

                break;
            }
            case 'complexUpdateSearch': {
                const { prevState, nextState } = action.payload;
                if (prevState.searchValue !== nextState.searchValue) {
                    if (nextState.searchValue) {
                        setState({
                            searchValue: nextState.searchValue,
                        });
                    } else {
                        await dispatch(ListActionCreators.search.resetSearch());
                    }
                    await dispatch(ListActionCreators.source.updateSavedState());
                }
                // Если searchInputValue был сброшен через publicSetState, его необходимо проставить
                if (
                    prevState.searchInputValue !== nextState.searchInputValue &&
                    !snapshots.get(SnapshotName.ComplexUpdate)?.isBeforeApplyState
                ) {
                    applyState({
                        searchInputValue: nextState.searchInputValue,
                    });
                }
                break;
            }
            case 'complexUpdateFilter': {
                const { prevState, nextState } = action.payload;

                if (
                    (
                        [
                            'filterDescription',
                            'countFilterValue',
                            'countFilterLinkedNames',
                            'countFilterValueConverter',
                        ] as const
                    ).some((name) => nextState[name] !== prevState[name])
                ) {
                    await dispatch(ListActionCreators.filter.setFilterDescription(nextState));
                }

                const filterDescriptionChanged = !isEqual(
                    prevState.filterDescription,
                    getState().filterDescription
                );

                let filterChanged = !isEqual(prevState.filter, nextState.filter);

                if (
                    nextState.filter &&
                    (filterDescriptionChanged ||
                        (filterChanged && getState().filterDescription?.length))
                ) {
                    await dispatch(ListActionCreators.filter.setFilter(nextState.filter));
                    filterChanged = true;
                }

                if (filterDescriptionChanged || filterChanged) {
                    const beforeSearch = snapshots.get(SnapshotName.BeforeSearch);
                    // Если во время поиска поменяли фильтр, то надо сбросить
                    // корень перед поиском, т.к мы можем в него не вернуться.
                    // Сбрасываем только если запомнили корень.
                    // Корень из "undefined" в "null" превращать нельзя.
                    if (beforeSearch && beforeSearch.root !== undefined) {
                        beforeSearch.root = null;
                    }
                }

                break;
            }
            case 'complexUpdateRoot': {
                const { prevState, nextState } = action.payload;
                if (prevState.root === nextState.root) {
                    break;
                }
                const processMarker =
                    // запрещены изменения в фазе beforeApplyState
                    !snapshots.get(SnapshotName.ComplexUpdate)?.isBeforeApplyState &&
                    // запрещены изменения маркера, если они пришли из publicSetState вместе с новым маркером
                    !(
                        snapshots.get(SnapshotName.ComplexUpdate)?.isPublicSetState &&
                        prevState.markedKey !== nextState.markedKey
                    );
                const processSearch = !snapshots.get(SnapshotName.ComplexUpdate)
                    ?.isBeforeApplyState;

                await dispatch(
                    ListActionCreators.root.changeRoot(nextState.root, processMarker, processSearch)
                );

                break;
            }
            case 'complexUpdateItems': {
                // TODO: временное решение. Поправится с поддержкой всех коллекций
                if (!getCollection()) {
                    break;
                }

                const { prevState, nextState } = action.payload;
                if (nextState.items && prevState.items !== nextState.items) {
                    await dispatch(
                        ListActionCreators.items.handleItemsChanged(
                            prevState.items,
                            nextState.items
                        )
                    );

                    await dispatch(ListActionCreators.items.replaceAllItems(nextState.items));
                }

                if (
                    nextState.hasMoreStorage &&
                    !isEqual(prevState.hasMoreStorage, nextState.hasMoreStorage)
                ) {
                    await dispatch(
                        ListActionCreators.source.updateHasMoreStorage(
                            nextState,
                            nextState.hasMoreStorage
                        )
                    );
                }

                if (nextState.keyProperty !== prevState.keyProperty) {
                    await dispatch(
                        ListActionCreators.items.changeKeyProperty(nextState.keyProperty)
                    );
                }
                break;
            }
            case 'complexUpdateExpandCollapse': {
                const { prevState, nextState } = action.payload;
                //# region Обновление состояния узлов
                if (
                    prevState.expandedItems !== nextState.expandedItems ||
                    prevState.collapsedItems !== nextState.collapsedItems
                ) {
                    await dispatch(
                        ListActionCreators.expandCollapse.setExpandCollapsedItems(
                            nextState.expandedItems,
                            nextState.collapsedItems
                        )
                    );
                }
                //# endregion
                break;
            }
            case 'complexUpdateItemActions': {
                const { prevState, nextState } = action.payload;
                const stateKeys: (keyof IListState)[] = [
                    'itemActionsProperty',
                    'itemActions',
                    'itemActionVisibilityCallback',
                ];

                //# region Обновление состояния
                const itemActionsChanged = stateKeys.some((prop) => {
                    return prevState[prop] !== nextState[prop];
                });

                if (itemActionsChanged) {
                    await dispatch(ListActionCreators.itemActions.updateItemActionsMap());
                    setState({
                        itemActionsProperty: nextState.itemActionsProperty,
                        itemActions: nextState.itemActions,
                        itemActionVisibilityCallback: nextState.itemActionVisibilityCallback,
                    });
                }
                //# endregion
                break;
            }
        }

        next(action);
    };

type ISnapshotsStore = Parameters<TListMiddleware>[0]['snapshots'];

// Удалится вместе с остальной обвязкой перехода после удаления функции beforeApplyState_fn
const FIELDS_USED_IN_NEW_CODE: (keyof IListState)[] = [
    'operationsPanelVisible',
    'markerVisibility',
    'markedKey',
    'multiSelectVisibility',
    'selectedKeys',
    'excludedKeys',
    'selectionModel',
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
    // @ts-expect-error Поле используется только в Controls/listWebReducers
    'promiseResolverForReloadOnly',
    // @ts-expect-error Поле используется только в Controls/listWebReducers
    '_loadItemsToDirectionPromiseResolver',
    'error',
    'errorViewConfig',
    'errorController',
    'sourceController',
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

const getUserState = (
    prevState: IListState,
    nextState: IListState,
    nextStateWithTranslation: IListState
) => {
    const keys = Array.from(
        new Set([...Object.keys(prevState), ...Object.keys(nextState)])
    ) as (keyof IListState)[];

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
    props: TMiddlewaresPropsForMigrationToDispatcher | null,
    collection: ICollection | undefined,
    snapshots: ISnapshotsStore,
    dispatch: Function,
    registerPendingPromise: TAbstractListMiddlewareContext['registerPendingPromise'],
    scheduleDispatch: Function
): Promise<IListState> {
    const needReloadBySelectionViewMode =
        (nextState.selectionViewMode === 'all' || nextState.selectionViewMode === 'hidden') &&
        currentState.selectionViewMode === 'selected';
    const excludedKeysChanged = !isEqual(currentState.excludedKeys, nextState.excludedKeys);
    const selectedKeysChanged = !isEqual(currentState.selectedKeys, nextState.selectedKeys);

    const viewModeChanged = nextState.viewMode !== currentState.viewMode;
    // Для правильной работы expandedCompositeTree.
    if (nextState.viewMode === 'composite') {
        nextState.expandedItems = [null];
    }
    const collapsedItemsChanged = !isEqual(currentState.collapsedItems, nextState.collapsedItems);
    const expandedItemsChanged = !isEqual(currentState.expandedItems, nextState.expandedItems);
    const countChanged = currentState.count !== nextState.count;

    const sourceControllerChanged = nextState.sourceController !== currentState.sourceController;
    const loadingPromises = [];
    const rootChanged = currentState.root !== nextState.root;
    const searchValueChanged =
        !isEqual(currentState.searchValue, nextState.searchValue) &&
        // Сброс поиска от смены корня не должен вызывать загрузку данных через resetSearch
        !(rootChanged && !nextState.searchValue);

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
            nextState.sourceController = createSourceController(currentState);
        } else {
            nextState.items = nextState.sourceController.getItems();
        }

        if (props?.sliceProperties) {
            props.sliceProperties.sourceController = nextState.sourceController;
        }
    }

    if (rootChanged && nextState.rootHistoryId) {
        USER.set(nextState.rootHistoryId, JSON.stringify(nextState.root));
    }
    if (
        !currentState.fix88221034174482 &&
        currentState.items &&
        nextState.items &&
        currentState.items !== nextState.items
    ) {
        props?.sliceCallbacks?.updateSubscriptionOnItems?.(currentState.items, nextState.items);
    }
    if ((expandedItemsChanged || countChanged) && currentState.listConfigStoreId) {
        await dispatch(
            ListActionCreators.source.setSavedSourceState(currentState.listConfigStoreId, nextState)
        );
    }

    const needReloadBySourceController = nextState.sourceController?.updateOptions(
        // TODO: source -> complexUpdate
        getSourceControllerOptions(nextState)
    );

    if (
        (needReloadBySourceController ||
            rootChanged ||
            searchValueChanged ||
            props?.sliceProperties?.newItems) &&
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
        snapshots.set(SnapshotName.ComplexUpdate, {
            ...(snapshots.get(SnapshotName.ComplexUpdate) || {}),
            _needReloadBySourceController: needReload,
        });
    }

    if (props?.sliceProperties?.newItems) {
        if (!needReload) {
            const newItems = props.sliceProperties.newItems;
            const direction = props.sliceProperties.newItemsDirection;
            const sourceConfig = props.sliceProperties.loadConfig?.sourceConfig;
            const keepNavigation = props.sliceProperties.loadConfig?.keepNavigation;
            props.sliceProperties.newItems = null;
            props.sliceProperties.loadConfig = null;
            props.sliceProperties.newItemsDirection = undefined;

            const dNewItemsReceived =
                _private_DecomposedPromise.getDecomposedPromise<Partial<IListState>>();

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
                    additionalPromise: undefined,

                    onResolve: dNewItemsReceived.resolve,
                    onReject: dNewItemsReceived.reject,
                })
            ).then(() => dNewItemsReceived.promise);
        } else {
            props.sliceProperties.newItems = null;
        }
    }

    if (
        props &&
        nextState.filter &&
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

        if (props.sliceProperties) {
            props.sliceProperties.previousViewMode = null;
        }
    }

    if (currentState.selectionViewMode === 'selected' && nextState.selectionViewMode === 'all') {
        snapshots.delete(SnapshotName.BeforeShowOnlySelected);
        nextState.isAllSelected = false;
        nextState.showSelectedCount = null;
        nextState.listCommandsSelection = getListCommandsSelection(nextState, snapshots);
    } else if (excludedKeysChanged || selectedKeysChanged) {
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
                nextState.listId &&
                operationsController &&
                operationsController?.getCounterConfig()?.count !== nextState.count
            ) {
                operationsController.updateSelectedKeysCount(
                    nextState.count,
                    nextState.isAllSelected,
                    nextState.listId
                );
            }
        } else if (
            nextState.filter &&
            nextState.selectedCountConfig &&
            (nextState.count === null || (filterChanged && nextState.selectedKeys.length))
        ) {
            const selection = {
                selected: nextState.selectedKeys,
                excluded: nextState.excludedKeys,
            };
            const countConfig = getCountConfig(nextState.selectedCountConfig, nextState.filter);
            nextState.countLoading = true;
            registerPendingPromise(
                'loadCount',
                loadCount(
                    selection,
                    countConfig,
                    nextState.selectionCountMode,
                    nextState.recursiveSelection
                ),
                'replace'
            )
                .then((newCount) => {
                    scheduleDispatch(
                        ListActionCreators.interactorCore.publicSetState<IListState>({
                            count: newCount as number | null | undefined,
                            countLoading: false,
                        })
                    );
                })
                .catch((error) => {
                    if (!error.isCanceled) {
                        getError('ANY', error);
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

    if (props?.sliceProperties && nextState.viewMode) {
        const searchViewMode = resolveSearchViewMode(
            !!currentState.adaptiveSearchMode,
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
    }

    if (expandedItemsChanged) {
        nextState.sourceController?.setExpandedItems(nextState.expandedItems);
        if (nextState.nodeHistoryId) {
            nextState.sourceController?.updateExpandedItemsInUserStorage();
        }
    } else if (needReload && !(nextState.sourceController?.isExpandAll() || nextState.deepReload)) {
        nextState.expandedItems = [];
        nextState.sourceController?.setExpandedItems([]);
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
        props?.sliceCallbacks?.applyState?.(stateForApply);
        // При смене рута props.sliceProperties.loadConfig хранит курсорную навигацию с изменённым position.
        // Нужно обновить курсорную навигацию в стейте и вызывать reloadSourceController() с нужной конфигурацией.
        let navigationSourceConfig;
        if (rootChanged && props?.sliceProperties?.loadConfig?.sourceConfig) {
            // Обновляем только курсорную навигацию
            if (nextState.navigation?.source === 'position') {
                navigationSourceConfig = props.sliceProperties.loadConfig?.sourceConfig;
                nextState.navigation = {
                    ...nextState.navigation,
                    // @ts-expect-error Необходимо выравнять типы конфигураций
                    sourceConfig: navigationSourceConfig,
                };
            }
            props.sliceProperties.loadConfig = null;
        }

        await dispatch(ListActionCreators.source.load(navigationSourceConfig));
    }

    if (
        collection &&
        !needReload &&
        !searchValueChanged &&
        (expandedItemsChanged || collapsedItemsChanged)
    ) {
        const expandedItemsDiff = getArrayDifference(
            currentState.expandedItems,
            nextState.expandedItems
        );

        if (expandedItemsDiff.added.length && nextState.source) {
            const dPromise = _private_DecomposedPromise.getDecomposedPromise<IListState>();

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
        return Promise.all(loadingPromises).then((results: IListState[]) =>
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

// Скопировано из Controls/Utils/ArraySimpleValuesUtil
/**
 * Утилита для простых операций с массивом, таких как:
 * - Получение индекса элемента
 * - Получение индекса элемента с проверкой по типу (String/Integer)
 * - Проверка наличия элемента в массиве
 * @private
 */
interface IDifferenceArrays<T extends any = any> {
    added: T[];
    removed: T[];
}

/**
 * Сравнивает два массива, возвращает разницу между ними
 * @param arrayOne
 * @param arrayTwo
 * @returns {{added: Array, removed: Array}}
 */
function getArrayDifference<T extends any = any>(
    arrayOne: T[],
    arrayTwo: T[]
): IDifferenceArrays<T> {
    return {
        removed: arrayOne.filter((item) => {
            return !hasInArray(arrayTwo, item);
        }),
        added: arrayTwo.filter((item) => {
            return !hasInArray(arrayOne, item);
        }),
    };
}

function hasInArray(array: any[], elem: unknown): boolean {
    return invertTypeIndexOf(array, elem) !== -1;
}

const CONSTRUCTORS_FOR_TYPE_INVERTING = {
    string: Number,
    number: String,
};

function invertTypeIndexOf(array: any[], elem: unknown): number {
    let index: number = array.indexOf(elem);

    if (index === -1) {
        const elementType = typeof elem;

        // Данная утилита используется для операций с массивами,
        // в которых могут лежать любые типы данных.
        // Инвертировать тип необходимо только для строк и чисел.
        // Для остальных типов данных это не имеет смысла и только вызывает тормоза
        if (
            (elementType === 'string' || elementType === 'number') &&
            CONSTRUCTORS_FOR_TYPE_INVERTING[elementType]
        ) {
            index = array.indexOf(CONSTRUCTORS_FOR_TYPE_INVERTING[elementType](elem));
        }
    }

    return index;
}
