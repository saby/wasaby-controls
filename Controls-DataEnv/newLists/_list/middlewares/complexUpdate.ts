/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isEqual } from 'Types/object';
import { TListMiddleware } from '../types/TListMiddleware';
import { SnapshotName } from '../types/SnapshotName';
import { ListActionCreators } from '../actions/creators';
import { IListState } from '../interface/IListState';
import { createSourceController } from '../ListWebInitializer/source';
import { _private_extractUtil } from 'Controls-DataEnv/abstractList';
import { isLoaded } from 'WasabyLoader/ModulesLoader';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

const {
    complexUpdate: {
        reduceState,
        oldBeforeApplyState,
        complexUpdateOperationsPanel,
        complexUpdateSelection,
        complexUpdateItems,
        complexUpdateItemActions,
        complexUpdateExpandCollapse,
        complexUpdateMarker,
        complexUpdateSearch,
        complexUpdateFilter,
        complexUpdateRoot,
        complexUpdateSource,
    },
    operationsPanel: { openOperationsPanel, closeOperationsPanel },
    source: { awaitAllRequests, updateSavedState, updateHasMoreStorage },
    items: { replaceAllItems, handleItemsChanged, changeKeyProperty },
    expandCollapse: { setExpandCollapsedItems },
    marker: { setMarkerVisibility, mark },
    selection: { setSelection },
    search: { resetSearch },
    filter: { setFilterDescription, setFilter },
    itemActions: { updateItemActionsMap },
} = ListActionCreators;

/**
 * Промежуточная функция(middleware) обработки действий, связанных с комплексным обновлением состояния(публичный setState)
 * @private
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
                const { items: prevItems } = prevState;

                snapshots.set(SnapshotName.ComplexUpdate, {
                    isReducingState: true,
                    isBeforeApplyState: true,
                });
                // #region Обновление состояния
                await dispatch(reduceState(prevState, getState()));

                // необходимо разнести всю логику из oldBeforeApplyState и этот экшен удалится
                await dispatch(
                    oldBeforeApplyState(
                        prevState,
                        getCompatibleNextState(prevState, getState(), getState())
                    )
                );

                if (isLoaded(LibPaths.ListWebReducers)) {
                    await dispatch(awaitAllRequests());
                }

                const newItems = getState().items;
                if (
                    getState().fix88221034174482 &&
                    prevItems &&
                    newItems &&
                    prevItems !== newItems
                ) {
                    const { _propsForMigrationToDispatcher } = getTrashBox();
                    await dispatch(replaceAllItems(newItems));
                    _propsForMigrationToDispatcher?.sliceCallbacks?.updateSubscriptionOnItems?.(
                        prevItems,
                        newItems
                    );
                }
                snapshots.delete(SnapshotName.ComplexUpdate);
                // #endregion Обновление состояния
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
                    reduceState(getState(), {
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

                await dispatch(complexUpdateOperationsPanel(prevState, nextState));
                await dispatch(complexUpdateSelection(prevState, nextState));
                await dispatch(complexUpdateItems(prevState, nextState));
                await dispatch(complexUpdateItemActions(prevState, nextState));
                await dispatch(complexUpdateExpandCollapse(prevState, nextState));
                await dispatch(complexUpdateMarker(prevState, nextState));
                await dispatch(complexUpdateSearch(prevState, nextState));
                await dispatch(complexUpdateFilter(prevState, nextState));
                await dispatch(complexUpdateRoot(prevState, nextState));
                await dispatch(complexUpdateSource(prevState, nextState));

                setState(getCompatibleNextState(originalSliceGetState(), nextState, getState()));

                break;
            }
            case 'complexUpdateSource': {
                const {
                    prevState: { sourceController: prevSourceController },
                    nextState: { sourceController: nextSourceController },
                } = action.payload;
                const sliceProperties =
                    getTrashBox()._propsForMigrationToDispatcher?.sliceProperties;

                if (sliceProperties && prevSourceController !== nextSourceController) {
                    // Нам не нужно отписываться от старого сорс контроллера, т.к.
                    // в момент выполнения Dispatcher.dispatch мы отписаны от контроллера источника.
                    // Это обеспечивает сейчас слайс.
                    const newSourceController = nextSourceController
                        ? nextSourceController
                        : createSourceController(action.payload.prevState);
                    sliceProperties.sourceController = newSourceController;
                    setState({
                        sourceController: newSourceController,
                    });

                    if (nextSourceController) {
                        // должно уехать в items мидлвару
                        setState({
                            items: newSourceController.getItems(),
                        });
                    }
                }
                break;
            }
            case 'complexUpdateOperationsPanel': {
                const {
                    prevState: {
                        operationsPanelVisible: prevOperationsPanelVisible,
                        multiSelectVisibility: prevMultiSelectVisibility,
                    },
                    nextState: {
                        operationsPanelVisible: nextOperationsPanelVisible,
                        multiSelectVisibility: nextMultiSelectVisibility,
                    },
                } = action.payload;

                const operationsPanelVisibleChanged =
                    prevOperationsPanelVisible !== nextOperationsPanelVisible;

                // TODO: Это не должно быть тут.
                //  Унести в selection, которая обновит снапшот и стейт.
                if (
                    prevMultiSelectVisibility !== nextMultiSelectVisibility &&
                    !snapshots.get(SnapshotName.BeforeOpenOperationsPanel)?.multiSelectVisibility &&
                    // обновление снэпшота должна происходить только после прикладника
                    snapshots.get(SnapshotName.ComplexUpdate)?.isBeforeApplyState
                ) {
                    snapshots.set(SnapshotName.BeforeOpenOperationsPanel, {
                        multiSelectVisibility: nextMultiSelectVisibility,
                    });
                }

                if (!operationsPanelVisibleChanged) {
                    break;
                }

                if (nextOperationsPanelVisible) {
                    await dispatch(openOperationsPanel());
                } else {
                    await dispatch(closeOperationsPanel());
                }

                break;
            }
            case 'complexUpdateMarker': {
                const {
                    prevState: { markerVisibility: prevMarkerVisibility, markedKey: prevMarkedKey },
                    nextState: {
                        markerVisibility: nextMarkerVisibility,
                        markedKey: nextMarkedKey,
                        fix1193265616,
                        operationsPanelVisible: nextOperationsPanelVisible,
                    },
                } = action.payload;

                if (prevMarkerVisibility !== nextMarkerVisibility) {
                    // Не скрываем маркер, если открыто ПМО и прикладной разработчик
                    // пытается скрыть маркер.
                    const shouldIgnoreVisibilityChange =
                        nextOperationsPanelVisible && nextMarkerVisibility === 'hidden';

                    // Если идет смена модели с поддерживаемой на неподдерживаемую,
                    // то в некоторых случаях не нужно проставлять маркер.
                    // Например, если маркер прикладным разработчиком не задан.
                    // У нас нет точек в слайсе, чтобы понять, задан ли маркер и нет точки,
                    // чтобы понять, какая модель будет следующая.
                    // Ошибка https://online.sbis.ru/opendoc.html?guid=883d4c50-ea09-41fb-8ba0-84178b820f6b&client=3
                    // Чтобы таких ошибок не было, нужно поддержать все модели.
                    // Задача https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
                    const isNextModelSupported = fix1193265616 !== true;

                    if (isNextModelSupported && !shouldIgnoreVisibilityChange) {
                        await dispatch(setMarkerVisibility(nextMarkerVisibility));
                    }
                }

                if (prevMarkedKey !== nextMarkedKey) {
                    await dispatch(mark(nextMarkedKey));
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

                await dispatch(setSelection(nextSelectedKeys, nextExcludedKeys));

                break;
            }
            case 'complexUpdateSearch': {
                const {
                    prevState: {
                        searchValue: prevSearchValue,
                        searchInputValue: prevSearchInputValue,
                    },
                    nextState: {
                        searchValue: nextSearchValue,
                        searchInputValue: nextSearchInputValue,
                    },
                } = action.payload;
                if (prevSearchValue !== nextSearchValue) {
                    if (nextSearchValue) {
                        setState({
                            searchValue: nextSearchValue,
                        });
                    } else {
                        await dispatch(resetSearch());
                    }
                    await dispatch(updateSavedState());
                }
                // Если searchInputValue был сброшен через publicSetState, его необходимо проставить
                if (
                    prevSearchInputValue !== nextSearchInputValue &&
                    !snapshots.get(SnapshotName.ComplexUpdate)?.isBeforeApplyState
                ) {
                    applyState({
                        searchInputValue: nextSearchInputValue,
                    });
                }
                break;
            }
            case 'complexUpdateFilter': {
                const { prevState, nextState } = action.payload;
                const { filter: prevFilter } = prevState;
                const { filter: nextFilter } = nextState;

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
                    await dispatch(setFilterDescription(nextState));
                }

                const filterDescriptionChanged = !isEqual(
                    prevState.filterDescription,
                    getState().filterDescription
                );

                let filterChanged = !isEqual(prevFilter, nextFilter);

                if (
                    nextFilter &&
                    (filterDescriptionChanged ||
                        (filterChanged && getState().filterDescription?.length))
                ) {
                    await dispatch(setFilter(nextFilter));
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
                const {
                    prevState: { root: prevRoot, markedKey: prevMarkedKey },
                    nextState: { root: nextRoot, markedKey: nextMarkedKey },
                } = action.payload;
                if (prevRoot === nextRoot) {
                    break;
                }
                const processMarker =
                    // запрещены изменения в фазе beforeApplyState
                    !snapshots.get(SnapshotName.ComplexUpdate)?.isBeforeApplyState &&
                    // запрещены изменения маркера, если они пришли из publicSetState вместе с новым маркером
                    !(
                        snapshots.get(SnapshotName.ComplexUpdate)?.isPublicSetState &&
                        prevMarkedKey !== nextMarkedKey
                    );
                const processSearch = !snapshots.get(SnapshotName.ComplexUpdate)
                    ?.isBeforeApplyState;

                await dispatch(
                    ListActionCreators.root.changeRoot(nextRoot, processMarker, processSearch)
                );

                break;
            }
            case 'complexUpdateItems': {
                // TODO: временное решение. Поправится с поддержкой всех коллекций
                if (!getCollection()) {
                    break;
                }

                const {
                    prevState: {
                        items: prevItems,
                        hasMoreStorage: prevHasMoreStorage,
                        keyProperty: prevKeyProperty,
                    },
                    nextState: {
                        items: nextItems,
                        keyProperty: nextKeyProperty,
                        hasMoreStorage: nextHasMoreStorage,
                    },
                } = action.payload;
                if (nextItems && prevItems !== nextItems) {
                    await dispatch(handleItemsChanged(prevItems, nextItems));

                    await dispatch(replaceAllItems(nextItems));
                }

                if (nextHasMoreStorage && !isEqual(prevHasMoreStorage, nextHasMoreStorage)) {
                    await dispatch(
                        updateHasMoreStorage(action.payload.nextState, nextHasMoreStorage)
                    );
                }

                if (nextKeyProperty !== prevKeyProperty) {
                    await dispatch(changeKeyProperty(nextKeyProperty));
                }
                break;
            }
            case 'complexUpdateExpandCollapse': {
                const {
                    prevState: {
                        expandedItems: prevExpandedItems,
                        collapsedItems: prevCollapsedItems,
                    },
                    nextState: {
                        expandedItems: nextExpandedItems,
                        collapsedItems: nextCollapsedItems,
                    },
                } = action.payload;
                //# region Обновление состояния узлов
                if (
                    prevExpandedItems !== nextExpandedItems ||
                    prevCollapsedItems !== nextCollapsedItems
                ) {
                    await dispatch(setExpandCollapsedItems(nextExpandedItems, nextCollapsedItems));
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
                    await dispatch(updateItemActionsMap());
                    setState(
                        _private_extractUtil(nextState, [
                            'itemActionsProperty',
                            'itemActions',
                            'itemActionVisibilityCallback',
                        ])
                    );
                }
                //# endregion
                break;
            }
        }

        next(action);
    };

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
