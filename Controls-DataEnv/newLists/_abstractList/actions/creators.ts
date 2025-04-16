import type { TKey, TSingleAxisDirection, TFilter } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';
import type { RecordSet } from 'Types/collection';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';
import type { Model } from 'Types/entity';

import type { TSelectionModel } from '../interface/IAbstractListStateParts/ISelectionState';
import type { IAbstractListState } from '../interface/IAbstractListState';
import type { TExpansionModel } from '../interface/IAbstractListStateParts/IHierarchyState';
import type { TAbstractListActions } from '../actions';
import type { THighlightedFieldsMap } from '../interface/IAbstractListStateParts/IHighlightState';
import type {
    TItemsChange,
    TListChangeSource,
} from '../interface/IAbstractListStateParts/IItemsState';
import type { TAddItemsMap, TReplaceItemsMap } from './types/_itemTypes';

import type {
    marker,
    selection,
    operationsPanel,
    root,
    search,
    source,
    expandCollapse,
    filter,
    interactorCore,
    highlightFields,
    itemActions,
    items,
    breadCrumbs,
    stub,
} from './types';
import * as coreActions from './types/_interactorCore';
import * as ActionCreatorLib from './creators/_actionCreator';

const { default: aCreator } = ActionCreatorLib;

//# region ==========       marker       ==========
/**
 * Конструктор действия для отметки записи маркером.
 */
const mark = (key: TKey | undefined): marker.TMarkAction =>
    aCreator('mark', {
        key,
    });

/**
 * Конструктор действия для установки нового MarkedKey
 */
const setMarkedKey = (key: TKey | undefined): marker.TSetMarkedKeyAction =>
    aCreator('setMarkedKey', {
        key,
    });
//# endregion ==========       marker       ==========

//# region ==========      selection     ==========
/**
 * Конструктор действия, для отметки записи с помощью множественного выделения.
 */
const select = (
    key: CrudEntityKey,
    direction?: TSingleAxisDirection,
    isRangeSelection?: boolean
): selection.TSelectAction =>
    aCreator('select', {
        key,
        direction,
        isRangeSelection,
    });

/**
 * Конструктор действия, для сброса текущей отметки записей.
 */
const resetSelection = (): selection.TResetSelectionAction => aCreator('resetSelection');

/**
 * Конструктор действия, для отметки всех записей.
 */
const selectAll = (): selection.TSelectAllAction => aCreator('selectAll');

/**
 * Конструктор действия, для инвертирования состояния выбора записей.
 */
const invertSelection = (): selection.TInvertSelectionAction => aCreator('invertSelection');

/**
 * Конструктор действия, для установки новой модели выделенных элементов.
 */
const setSelectionModel = (selectionModel: TSelectionModel): selection.TSetSelectionModelAction =>
    aCreator('setSelectionModel', {
        selectionModel,
    });

/**
 * Конструктор действия, для установки количества выделенных элементов.
 */
const setSelectionCount = (
    count: number | null,
    isAllSelected: boolean,
    listId?: string
): selection.TSetSelectionCount =>
    aCreator('setSelectionCount', {
        count,
        isAllSelected,
        listId,
    });

//# endregion ==========      selection     ==========

//# region ==========   operationsPanel  ==========
/**
 * Конструктор действия, для открытия панели массовых операций.
 * @function
 * @return operationsPanel.TOpenOperationsPanelAction
 */
const openOperationsPanel = (): operationsPanel.TOpenOperationsPanelAction =>
    aCreator('openOperationsPanel');

/**
 * Конструктор действия, для закрытия панели массовых операций.
 * @function
 * @return operationsPanel.TCloseOperationsPanelAction
 */
const closeOperationsPanel = (): operationsPanel.TCloseOperationsPanelAction =>
    aCreator('closeOperationsPanel');

/**
 * Конструктор действия для установки выделенных элементов в ПМО.
 */
const setListCommandsSelection = (
    listCommandsSelection: IAbstractListState['listCommandsSelection']
): operationsPanel.TSetListCommandsSelectionAction =>
    aCreator('setListCommandsSelection', { listCommandsSelection });

/**
 * Конструктор действия, для обновления состояния выделения в ПМО.
 */
const updateOperationsSelection = (): operationsPanel.TUpdateOperationsSelectionAction => ({
    type: 'updateOperationsSelection',
    payload: {},
});

/**
 * Конструктор действия, чтобы отобрать отмеченные записи.
 */
const showSelected = (): operationsPanel.TShowSelectedAction => aCreator('showSelected');
/**
 * Конструктор действия, чтобы показать все записи.
 */
const showAll = (): operationsPanel.TShowAllAction => aCreator('showAll');

/**
 * Конструктор действия для установки режима отображения выбора через ПМО.
 */
const setSelectionViewMode = (
    selectionViewMode: IAbstractListState['selectionViewMode']
): operationsPanel.TSetSelectionViewModeAction =>
    aCreator('setSelectionViewMode', { selectionViewMode });

//# endregion ==========   operationsPanel  ==========

//# region ==========        root        ==========
/**
 * Конструктор действия, для установки нового корня иерархии.
 */
const setRoot = (root: TKey): root.TSetRootAction =>
    aCreator('setRoot', {
        root,
    });

/**
 * Тип действия, для изменения корня иерархии.
 */
const changeRoot = (
    root: TKey,
    processMarker: boolean = true,
    processSearch: boolean = true
): root.TChangeRootAction =>
    aCreator('changeRoot', {
        root,
        processMarker,
        processSearch,
    });

//# endregion ==========        root        ==========

//# region ==========       search       ==========
/**
 * Конструктор действия, для сброса текущего поиска.
 * @function
 * @return search.TResetSearchAction
 */
export const resetSearch = (): search.TResetSearchAction => aCreator('resetSearch');

/**
 * Конструктор действия, для начала поиска.
 * @function
 * @param {string} searchValue Поисковое значение
 * @return search.TStartSearchAction
 */
export const startSearch = (searchValue: string): search.TStartSearchAction =>
    aCreator('startSearch', {
        searchValue,
    });

//# endregion ==========       search       ==========

//# region ==========       source       ==========
/**
 * Конструктор действия, для загрузки предыдущей пачки данных.
 * @function
 * @return source.TLoadPrevAction
 */
export const loadPrev = (
    addItemsAfterLoad?: boolean,
    useServicePool?: boolean,
    onResolve?: Function,
    onReject?: Function
): source.TLoadPrevAction =>
    aCreator('loadPrev', {
        addItemsAfterLoad,
        useServicePool,
        onResolve,
        onReject,
    });

/**
 * Конструктор действия, для загрузки следующей пачки данных.
 * @function
 * @return source.TLoadNextAction
 */
export const loadNext = (
    addItemsAfterLoad?: boolean,
    useServicePool?: boolean,
    onResolve?: Function,
    onReject?: Function,
    key?: TKey
): source.TLoadNextAction =>
    aCreator('loadNext', {
        addItemsAfterLoad,
        useServicePool,
        onResolve,
        onReject,
        key,
    });

//# endregion ==========       source       ==========

//# region ==========   expandCollapse   ==========
/**
 * Конструктор действия для разворота узла.
 * @function
 * @param {CrudEntityKey} key Ключ узла
 * @param {Boolean} markItem Определяет будет ли развернутый узел отмечен маркером
 * @return expandCollapse.TExpandAction
 */
const expand = (key: CrudEntityKey, markItem: boolean = true): expandCollapse.TExpandAction =>
    aCreator('expand', {
        key,
        markItem,
    });

/**
 * Конструктор действия для сворачивания узла.
 * @function
 * @param {CrudEntityKey} key Ключ узла
 * @param {Boolean} markItem Определяет будет ли развернутый узел отмечен маркером
 * @return expandCollapse.TCollapseAction
 */
const collapse = (key: CrudEntityKey, markItem: boolean = true): expandCollapse.TCollapseAction =>
    aCreator('collapse', {
        key,
        markItem,
    });

/**
 * Конструктор действия для сброса состояния развернутости узлов.
 * @function
 * @return expandCollapse.TResetExpansionAction
 */
const resetExpansion = (): expandCollapse.TResetExpansionAction => aCreator('resetExpansion');

/**
 * Конструктор действия для обновления модели раскрытых узлов.
 */
const setExpansionModel = (
    expansionModel: TExpansionModel
): expandCollapse.TSetExpansionModelAction => aCreator('setExpansionModel', { expansionModel });

//# endregion ==========   expandCollapse   ==========

//# region ==========       filter       ==========
/**
 * Конструктор действия для установки нового фильтра.
 * @function
 * @param {TFilter} filter Фильтр
 * @return filter.TSetFilterAction
 */
const setFilter = (filter: TFilter): filter.TSetFilterAction =>
    aCreator('setFilter', {
        filter,
    });

/**
 * Конструктор действия для открытия окон фильтров.
 * @function
 * @return filter.TOpenFilterDetailPanelAction
 */
const openFilterDetailPanel = (): filter.TOpenFilterDetailPanelAction =>
    aCreator('openFilterDetailPanel');

/**
 * Конструктор действия для закрытия окон фильтров.
 * @function
 * @return filter.TCloseFilterDetailPanelAction
 */
const closeFilterDetailPanel = (): filter.TCloseFilterDetailPanelAction =>
    aCreator('closeFilterDetailPanel');

//# endregion ==========       filter       ==========

//# region ==========   interactorCore   ==========
/**
 * Конструктор действия, для установки подключения слоя представления к ViewModel.
 */
const connect = (): interactorCore.TConnectAction => aCreator('connect');

/**
 * Конструктор действия, для отключения слоя представления от ViewModel.
 */
const disconnect = (): interactorCore.TDisconnectAction => aCreator('disconnect');

/**
 * Конструктор действия для метода установки нового состояния.
 * @function
 * @param {IAbstractListState | ((nextState: IAbstractListState) => IAbstractListState} nextState новое состояние
 * @return interactorCore.TPublicSetStateAction
 */
const publicSetState = <TState extends IAbstractListState = IAbstractListState>(
    nextState: Partial<TState> | ((prevState: TState) => Partial<TState>)
): interactorCore.TPublicSetStateAction<TState> =>
    aCreator(coreActions.PublicSetStateSymbol, {
        nextState,
    });

/**
 * Конструктор действия для применения нового состояния, расчитанного в publicSetState.
 * @function
 * @param {Partial<TState>} partialNextState новое состояние
 * @return interactorCore.TOnPublicSetStateAction
 */
const onPublicSetState = <TState extends IAbstractListState = IAbstractListState>(
    partialNextState: Partial<TState>
): interactorCore.TOnPublicSetStateAction<TState> =>
    aCreator('onPublicSetState', {
        partialNextState,
    });

/**
 * Конструктор действия, для фазы расчета состояния перед исполнением экшенов..
 * @function
 * @return interactorCore.TOnBeforeStartUpdateAction
 */
const onBeforeStartUpdate = (): interactorCore.TOnBeforeStartUpdateAction =>
    aCreator('onBeforeStartUpdate', {});

/**
 * Конструктор действия для фазы расчета состояния по экшенам.
 * @function
 * @param {IAbstractListState} prevState Прошлое состояние
 * @param {TAbstractListActions.TAnyAbstractListAction[]} actions Испоняемые экшены
 * @return interactorCore.TStartUpdateAction
 */
const startUpdate = (
    prevState: IAbstractListState,
    actions: TAbstractListActions.TAnyAbstractListAction[]
): interactorCore.TStartUpdateAction =>
    aCreator(coreActions.StartUpdateSymbol, {
        prevState,
        actions,
    });

/**
 * Конструктор действия, для фазы после расчета состояния по экшенам и до выполнения прикладного bas
 * @function
 * @param {IListState} prevState Прошлое состояние
 * @return interactorCore.TOnAfterStartUpdateAction
 */
const onAfterStartUpdate = <TState extends IAbstractListState>(
    prevState: TState
): interactorCore.TOnAfterStartUpdateAction<TState> =>
    aCreator('onAfterStartUpdate', {
        prevState,
    });

/**
 * Конструктор действия для имитации фазы старого beforeApplyState для прикладника.
 * @function
 * @param {IAbstractListState} prevState Прошлое состояние
 * @param {IAbstractListState} nextState Прошлое состояние
 * @return interactorCore.TBeforeApplyStateAction
 */
const beforeApplyState = (
    prevState: IAbstractListState,
    nextState: IAbstractListState
): interactorCore.TBeforeApplyStateAction =>
    aCreator(coreActions.BeforeApplyStateSymbol, {
        prevState,
        nextState,
    });

// будет удален после переноса блокирующих загрузок в неблокирующие
/**
 * Конструктор действия, для имитации фазы старого beforeApplyState.
 * @function
 * @param {IListState} prevState Прошлое состояние
 * @return interactorCore.TOnAfterBeforeApplyStateAction
 */
const onAfterBeforeApplyState = <TState extends IAbstractListState>(
    prevState: TState
): interactorCore.TOnAfterBeforeApplyStateAction<TState> =>
    aCreator('onAfterBeforeApplyState', {
        prevState,
    });

/**
 * Конструктор действия, для обработки состояния после прикладного beforeApplyState.
 */
const endUpdate = <TState extends IAbstractListState>(
    prevState: TState,
    nextState: TState
): interactorCore.TEndUpdateAction<TState> =>
    aCreator(coreActions.EndUpdateSymbol, {
        prevState,
        nextState,
    });

/**
 * Конструктор действия, для обработки состояния после прикладного beforeApplyState.
 */
const onEndUpdate = <TState extends IAbstractListState>(
    prevState: TState,
    nextState: TState
): interactorCore.TOnEndUpdateAction<TState> =>
    aCreator('onEndUpdate', {
        prevState,
        nextState,
    });

//# endregion ==========   interactorCore   ==========

//# region ==========   highlightFields  ==========
/**
 * Конструктор действия, для установки модели подсветки полей.
 */
const setHighlightedFieldsMap = (
    highlightedFieldsMap: THighlightedFieldsMap
): highlightFields.TSetHighlightedFieldsMapAction =>
    aCreator('setHighlightedFieldsMap', {
        highlightedFieldsMap,
    });

//# endregion ==========   highlightFields  ==========

//# region ==========     itemActions    ==========
/**
 * Конструктор действия для обновления модели, описывающей операции над записями.
 * @function
 * @return itemActions.TUpdateItemActionsMapAction
 */
const updateItemActionsMap = (): itemActions.TUpdateItemActionsMapAction =>
    aCreator('updateItemActionsMap');

//# endregion ==========     itemActions    ==========

//# region ==========        items       ==========
/**
 * Конструктор действия, для замены всех записей.
 */
const replaceAllItems = (newItems: RecordSet): items.TReplaceAllItemsAction =>
    aCreator('replaceAllItems', {
        items: newItems,
    });

/**
 * Конструктор действия для уведомления о замене всех записей.
 * @function
 * @param {RecordSet} items Новые элементы
 * @return items.TOnAllItemsReplacedAction
 */
const onAllItemsReplaced = (items: RecordSet): items.TOnAllItemsReplacedAction =>
    aCreator('onAllItemsReplaced', {
        items,
    });

/**
 * Конструктор действия, для добавления записей после указанных ключей.
 */
const appendItems = (
    itemsMap: TAddItemsMap,
    changeSource: TListChangeSource
): items.TAppendItemsAction =>
    aCreator('appendItems', {
        items: itemsMap,
        changeSource,
    });

/**
 * Конструктор действия, для добавления записей перед указанными ключами.
 */
const prependItems = (
    itemsMap: TAddItemsMap,
    changeSource: TListChangeSource
): items.TPrependItemsAction =>
    aCreator('prependItems', {
        items: itemsMap,
        changeSource,
    });

/**
 * Конструктор действия, для установки маркера при добавлении записей.
 * @return items.TOnItemsAddedAction
 */
const onItemsAdded = (): items.TOnItemsAddedAction => ({
    type: 'onItemsAdded',
    payload: {},
});

/**
 * Конструктор действия для сброса записей.
 */
const resetItems = (
    newItems: Model[],
    oldItems: Model[],
    removedItemsIndex: number,
    changeSource: TListChangeSource
): items.TResetItemsAction =>
    aCreator('resetItems', {
        newItems,
        oldItems,
        removedItemsIndex,
        changeSource,
    });

/**
 * Конструктор действия для уведомления о сбросе записей.
 * @param {Model[]} newItems Новые записи
 * @param {Model[]} oldItems Старые записи
 * @param {number} removedItemsIndex Индекс, в котором удалены элементы
 * @return items.TOnItemsResetAction
 */
const onItemsReset = (
    newItems: Model[],
    oldItems: Model[],
    removedItemsIndex: number
): items.TOnItemsResetAction => ({
    type: 'onItemsReset',
    payload: {
        newItems,
        oldItems,
        removedItemsIndex,
    },
});

/**
 * Конструктор действия, для замены записей.
 */
const replaceItems = (
    itemsMap: TReplaceItemsMap,
    changeSource: TListChangeSource
): items.TReplaceItemsAction =>
    aCreator('replaceItems', {
        items: itemsMap,
        changeSource,
    });

/**
 * Конструктор действия, для установки маркера при добавлении записей.
 * @return items.TOnItemsReplacedAction
 */
const onItemsReplaced = (): items.TOnItemsReplacedAction => ({
    type: 'onItemsReplaced',
    payload: {},
});

/**
 * Конструктор действия, для удаления записей.
 * @function
 * @param {CrudEntityKey[]} keys Ключи записей
 * @param {Number} index Индекс записи
 * @param {TListChangeSource} changeSource Источник ченджа
 * @param {string | undefined} reason Причина удаления элементов
 * @return items.TRemoveItemsAction
 */
const removeItems = (
    keys: CrudEntityKey[],
    index: number,
    changeSource: TListChangeSource,
    reason?: string
): items.TRemoveItemsAction =>
    aCreator('removeItems', {
        keys,
        index,
        changeSource,
        reason,
    });

/**
 * Конструктор действия для уведомления об удалении записей.
 * @function
 * @param {number} index Индекс, в котором удалены элементы
 * @param {CrudEntityKey[]} keys Ключи удаленных элементов
 * @param {string | undefined} reason Причина удаления элементов
 * @return items.TOnItemsRemovedAction
 */
const onItemsRemoved = (
    index: number,
    keys: CrudEntityKey[],
    reason?: string
): items.TOnItemsRemovedAction => ({
    type: 'onItemsRemoved',
    payload: {
        index,
        keys,
        reason,
    },
});

/**
 *
 */
const setHasMoreStorage = (hasMoreStorage: IHasMoreStorage): items.TSetHasMoreStorageAction =>
    aCreator('setHasMoreStorage', {
        hasMoreStorage,
    });

/**
 * Конструктор действия, для установки имени поля записи, в котором хранится первичный ключ.
 * @function
 * @param {String} keyProperty Имя поля записи, в котором хранится первичный ключ
 * @return items.TChangeKeyPropertyAction
 */
const changeKeyProperty = (keyProperty: string): items.TChangeKeyPropertyAction =>
    aCreator('changeKeyProperty', {
        keyProperty,
    });

/**
 * Конструктор действия, для замены метаданных.
 * @function
 * @param {unknown} metaData Метаданные
 * @return items.TReplaceMetaDataAction
 */
const replaceMetaData = (metaData: unknown): items.TReplaceMetaDataAction =>
    aCreator('replaceMetaData', {
        metaData,
    });

/**
 * Конструктор действия, для установки метаданных.
 * @function
 * @param {unknown} metaData Метаданные
 * @return items.TMergeMetaDataAction
 */
const mergeMetaData = (metaData: unknown): items.TMergeMetaDataAction =>
    aCreator('mergeMetaData', {
        metaData,
    });

/**
 * Конструктор действия, для уведомления об изменении записей.
 * @function
 * @param {RecordSet | undefined} prevItems Прошлые элементы
 * @param {RecordSet | undefined} nextItems Новые элементы
 * @return items.THandleItemsChangedAction
 */
const handleItemsChanged = (
    prevItems?: RecordSet,
    nextItems?: RecordSet
): items.THandleItemsChangedAction =>
    aCreator('handleItemsChanged', {
        prevItems,
        nextItems,
    });

/**
 * Конструктор действия, для применения изменений записей с коллекции.
 */
export const setItemsChanges = (itemsChanges: TItemsChange[]): items.TSetItemsChangesAction => ({
    type: 'setItemsChanges',
    payload: {
        itemsChanges,
    },
});

//# endregion ==========        items       ==========

//# region ==========     breadCrumbs    ==========
/**
 * Конструктор действия, для установки новых хлебных крошек.
 * @function
 * @param {null | Model[]} breadCrumbsItems Хлебные крошки
 * @param {string} backButtonCaption Текст кнопки назад
 * @param {Model} backButtonItem Запись для кнопки назад
 * @return breadCrumbs.TSetBreadCrumbsAction
 */
export const setBreadCrumbs = (
    breadCrumbsItems: null | Model[],
    backButtonCaption: string = '',
    backButtonItem: Model | undefined
): breadCrumbs.TSetBreadCrumbsAction =>
    aCreator('setBreadCrumbs', {
        breadCrumbsItems,
        backButtonCaption,
        backButtonItem,
    });

//# endregion ==========     breadCrumbs    ==========

//# region ==========        stub        ==========
/**
 * Конструктор действия для установки видимости заглушки.
 * @function
 * @param {boolean} needShowStub Показывать ли заглушку
 * @return stub.TSetStubVisibilityAction
 */
export const setStubVisibility = (needShowStub: boolean): stub.TSetStubVisibilityAction => ({
    type: 'setStubVisibility',
    payload: {
        needShowStub,
    },
});

//# endregion ==========        stub        ==========

/**
 * Конструкторы действий, доступные в любом списке, независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
const AbstractListActionCreators = {
    /**
     * Конструкторы действий ядра интерактивности.
     * @see https://online.sbis.ru/area/039c82f1-a0a3-4548-82d6-c9e1dbaf5de0 Зона Kaizen
     */
    interactorCore: {
        connect,
        disconnect,
        publicSetState,
        onPublicSetState,
        onBeforeStartUpdate,
        startUpdate,
        onAfterStartUpdate,
        beforeApplyState,
        onAfterBeforeApplyState,
        endUpdate,
        onEndUpdate,
    },

    /**
     * Конструкторы действий функционала "Отметка маркером".
     * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
     */
    marker: { mark, setMarkedKey },

    /**
     * Конструкторы действий функционала "Отметка чекбоксом".
     * @see https://online.sbis.ru/area/02f42333-cf50-42e8-bc08-b451cc483285 Зона Kaizen
     */
    selection: {
        select,
        resetSelection,
        selectAll,
        invertSelection,
        setSelectionModel,
        setSelectionCount,
    },

    /**
     * Конструкторы действий функционала "Взаимодействие с панелью массовых операций".
     * @see https://online.sbis.ru/area/ccc545f6-e213-4e99-bd2c-41421c3068b6 Зона Kaizen
     */
    operationsPanel: {
        openOperationsPanel,
        closeOperationsPanel,
        setListCommandsSelection,
        updateOperationsSelection,
        showSelected,
        showAll,
        setSelectionViewMode,
    },

    /**
     * Конструкторы действий функционала "Проваливание".
     * @see https://online.sbis.ru/area/f77b7722-2f7f-4c69-b029-a00480c0d33b Зона Kaizen
     */
    root: {
        setRoot,
        changeRoot,
    },

    /**
     * Конструкторы действий функционала "Разворот и сворачивание узлов".
     * @see https://online.sbis.ru/area/4dc07e22-16bc-4793-9b70-c6819cf515fb Зона Kaizen
     */
    expandCollapse: { expand, collapse, resetExpansion, setExpansionModel },

    /**
     * Конструкторы действий функционала "Фильтрация".
     * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
     */
    filter: { setFilter, openFilterDetailPanel, closeFilterDetailPanel },

    /**
     * Конструкторы действий функционала "Взаимодействие с поиском".
     * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
     */
    search: {
        resetSearch,
        startSearch,
    },

    /**
     * Конструкторы действий для работы ViewModel с источником данных.
     */
    source: { loadNext, loadPrev },

    /**
     * Конструкторы действий функционала "Работа с подсветкой полей".
     */
    highlightFields: {
        setHighlightedFieldsMap,
    },

    /**
     * Конструкторы действий функционала "Работа с рекордсетом записей".
     */
    items: {
        replaceAllItems,
        onAllItemsReplaced,
        appendItems,
        prependItems,
        onItemsAdded,
        resetItems,
        onItemsReset,
        replaceItems,
        onItemsReplaced,
        removeItems,
        onItemsRemoved,
        setHasMoreStorage,
        changeKeyProperty,
        replaceMetaData,
        mergeMetaData,
        handleItemsChanged,
        setItemsChanges,
    },

    /**
     * Конструкторы действий функционала "Работа с действиями над записью".
     */
    itemActions: {
        updateItemActionsMap,
    },

    /**
     * Конструкторы действий функционала "Работа с хлебными крошками".
     */
    breadCrumbs: { setBreadCrumbs },

    /**
     * Конструкторы действий функционала "Работа с заглушкой".
     */
    stub: { setStubVisibility },
};

export default AbstractListActionCreators;
