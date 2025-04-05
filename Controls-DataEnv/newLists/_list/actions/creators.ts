import type { TKey, TSingleAxisDirection } from 'Controls-DataEnv/interface';
import type { IListSavedState } from 'Controls/dataSource';
import type { IBaseSourceConfig, INavigationSourceConfig } from 'Controls-DataEnv/listTypes';
import type { CrudEntityKey } from 'Types/source';
import type { IReloadItemOptions } from 'Controls/listCommands';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';

import type { IListState } from '../interface/IListState';

import type {
    marker,
    selection,
    operationsPanel,
    filter,
    source,
    complexUpdate,
    expandCollapse,
    error,
} from './types';

import { AbstractListActionCreators } from 'Controls-DataEnv/abstractList';
import * as ActionCreatorLib from './creators/_actionCreator';
const { default: aCreator } = ActionCreatorLib;

//# region ==========       marker       ==========
/**
 * Конструктор действия для установки режима отображения маркера.
 * @function
 * @param {"visible" | "hidden" | "onactivated"} visibility Режим отображения
 * @return marker.TSetMarkerVisibilityAction
 */
const setMarkerVisibility = (
    visibility?: IListState['markerVisibility']
): marker.TSetMarkerVisibilityAction =>
    aCreator('setMarkerVisibility', {
        visibility,
    });

/**
 * Конструктор действия для попытки показать маркер.
 * @function
 * @return marker.TActivateMarkerAction
 */
const activateMarker = (): marker.TActivateMarkerAction => aCreator('activateMarker', {});

/**
 * Конструктор действия для отметки ближайшей записи.
 * @function
 * @param {number} index Индекс записи
 * @param {number} key Ключ записи
 * @return marker.TMarkNearbyItemAction
 */
const markNearbyItem = (index: number, key?: TKey): marker.TMarkNearbyItemAction =>
    aCreator('markNearbyItem', {
        index,
        key,
    });

/**
 * Конструктор действия для отметки следующей записи в заданном направлении.
 */
const markNext = (direction?: TSingleAxisDirection): marker.TMarkNextAction =>
    aCreator('markNext', {
        direction,
    });

//# endregion ==========       marker       ==========

//# region ==========      selection     ==========
/**
 * Конструктор действия, для установки видимости множественного выделения.
 */
const setSelectionVisibility = (
    visibility: IListState['multiSelectVisibility']
): selection.TSetSelectionVisibilityAction =>
    aCreator('setSelectionVisibility', {
        visibility,
    });

/**
 * Конструктор действия, для установки ключей выделенных записей.
 * @function
 * @param selectedKeys Ключи выделенных записей.
 * @param excludedKeys Ключи записей, исключенных из выделения.
 * @return selection.TSetSelectionAction
 */
const setSelection = (selectedKeys: TKey[], excludedKeys: TKey[]): selection.TSetSelectionAction =>
    aCreator('setSelection', {
        selectedKeys,
        excludedKeys,
    });

/**
 * Конструктор действия, для обновления счетчика выделенных записей
 */
const updateCounter = (): selection.TUpdateCounterAction => aCreator('updateCounter', {});

//# endregion ==========      selection     ==========

//# region ==========   operationsPanel  ==========
/**
 * Конструктор действия, для сброса режима выбора через ПМО.
 */
const resetSelectionViewMode = (): operationsPanel.TResetSelectionViewModeAction =>
    aCreator('resetSelectionViewMode', {});

//# endregion ==========   operationsPanel  ==========

//# region ==========       filter       ==========

/**
 * Конструктор действия, для установки структуры фильтров.
 */
const setFilterDescription = ({
    filterDescription,
    countFilterValue,
    countFilterLinkedNames,
    countFilterValueConverter,
    countFilterUserPeriods,
    countFilterPeriodType,
}: Pick<
    filter.IFilterState,
    | 'filterDescription'
    | 'countFilterValue'
    | 'countFilterLinkedNames'
    | 'countFilterValueConverter'
    | 'countFilterUserPeriods'
    | 'countFilterPeriodType'
>): filter.TSetFilterDescriptionAction =>
    aCreator('setFilterDescription', {
        filterDescription,
        countFilterValue,
        countFilterLinkedNames,
        countFilterValueConverter,
        countFilterUserPeriods,
        countFilterPeriodType,
    });

//# endregion ==========       filter       ==========

//# region ==========       source       ==========

// FIXME: Типы действий описаны только чтобы собралась дока,
//  т.к. сами действия не те, что должны быть.
/**
 * Конструктор действия setSavedSourceState
 */
const setSavedSourceState = (
    id: string,
    state: Partial<IListSavedState>
): source.TSetSavedSourceStateAction =>
    aCreator('setSavedSourceState', {
        id,
        state,
    });

/**
 * Конструктор действия updateSavedState
 */
const updateSavedState = (): source.TUpdateSavedSourceStateAction =>
    aCreator('updateSavedSourceState', {});

/**
 * Конструктор действия reload
 */
const reload = (
    sourceConfig?: INavigationSourceConfig,
    keepNavigation?: boolean,
    onResolve?: Function,
    onReject?: Function
): source.TReloadAction =>
    aCreator('reload', {
        sourceConfig,
        keepNavigation,
        onResolve,
        onReject,
    });

/**
 * Конструктор действия newItemsReceived
 */
const newItemsReceived = (
    payload: source.TNewItemsReceivedAction['payload']
): source.TNewItemsReceivedAction => aCreator('newItemsReceived', payload);

/**
 * Конструктор действия load
 */
const load = (sourceConfig?: IBaseSourceConfig): source.TLoadAction =>
    aCreator('load', { sourceConfig });

/**
 * Конструктор действия oldSliceLoad
 */
const oldSliceLoad = (payload: source.TOldSliceLoadAction['payload']): source.TOldSliceLoadAction =>
    aCreator('oldSliceLoad', payload);

/**
 * Конструктор действия dataLoadedSuccess
 */
const dataLoadedSuccess = (
    payload: source.TDataLoadedSuccessAction['payload']
): source.TDataLoadedSuccessAction => aCreator('dataLoadedSuccess', payload);

/**
 * Конструктор действия fetch
 */
const fetch = (): source.TFetchAction => aCreator('fetch', {});

/**
 * Конструктор действия requestFetch
 */
const requestFetch = (): source.TRequestFetchAction => aCreator('requestFetch', {});

/**
 * Конструктор действия initSource
 */
const initSource = (): source.TInitSourceAction => aCreator('initSource', {});

/**
 * Конструктор действия awaitAllRequests
 */
const awaitAllRequests = (): source.TAwaitAllRequests => aCreator('awaitAllRequests', {});

/**
 * Конструктор действия для отмены текущей загрузки
 */
const rejectLoad = (): source.TRejectLoadAction => aCreator('rejectLoad', {});

/**
 * Конструктор действия loadOnSourceController
 */
const loadOnSourceController = (
    payload: source.TLoadOnSourceControllerAction['payload']
): source.TLoadOnSourceControllerAction => aCreator('loadOnSourceController', payload);

/**
 * Конструктор действия reloadOnSourceController
 */
const reloadOnSourceController = (
    payload: source.TReloadOnSourceControllerAction['payload']
): source.TReloadOnSourceControllerAction =>
    aCreator('reloadOnSourceController', {
        ...payload,
        isFirstLoad: !!payload.isFirstLoad,
    });

/**
 * Конструктор действия loadNodes
 */
const loadNodes = (payload: source.TLoadNodesAction['payload']): source.TLoadNodesAction =>
    aCreator('loadNodes', payload);

/**
 * Конструктор действия loadToDirection
 */
const loadToDirection = (
    payload: source.TLoadToDirectionAction['payload']
): source.TLoadToDirectionAction => aCreator('loadToDirection', payload);

/**
 * Конструктор действия setPreloadedItems
 */
const setPreloadedItems = (
    payload: source.TSetPreloadedItemsAction['payload']
): source.TSetPreloadedItemsAction => aCreator('setPreloadedItems', payload);

/**
 * Конструктор действия resolveStateAfterUpdateItems
 */
const resolveStateAfterUpdateItems = (
    payload: source.TResolveStateAfterUpdateItemsAction['payload']
): source.TResolveStateAfterUpdateItemsAction => aCreator('resolveStateAfterUpdateItems', payload);

/**
 * Конструктор действия reloadItem
 */
const reloadItem = (
    key: CrudEntityKey,
    options?: IReloadItemOptions,
    onResolve?: Function,
    onReject?: Function
): source.TReloadItemAction =>
    aCreator('reloadItem', {
        key,
        options,
        onResolve,
        onReject,
    });

/**
 * Конструктор действия reloadItems
 */
const reloadItems = (
    keys: CrudEntityKey[],
    onResolve?: Function,
    onReject?: Function
): source.TReloadItemsAction =>
    aCreator('reloadItems', {
        keys,
        onResolve,
        onReject,
    });

/**
 * Конструктор действия updateHasMoreStorage
 */
const updateHasMoreStorage = (
    nextState: IListState,
    hasMoreStorage: IHasMoreStorage
): source.TUpdateHasMoreStorageAction =>
    aCreator('updateHasMoreStorage', {
        nextState,
        hasMoreStorage,
    });

//# endregion ==========       source       ==========

//# region ==========    complexUpdate   ==========

const complexUpdateCreator = <TTypeName extends string = string>(
    name: TTypeName,
    prevState: IListState,
    nextState: IListState
) =>
    aCreator(`complexUpdate${name}`, {
        prevState,
        nextState,
    });

/**
 * Конструктор действия, для сборки нового состояния.
 * @function
 * @param {IListState} prevState Прошлое состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TReduceStateAction
 */
const reduceState = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TReduceStateAction =>
    aCreator('reduceState', {
        prevState,
        nextState,
    });

/**
 * Конструктор действия, для выполнения старого кода комплексного обновления.
 * Непереведенный код списочного слайса.
 */
const oldBeforeApplyState = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TOldBeforeApplyStateAction =>
    aCreator('oldBeforeApplyState', {
        prevState,
        nextState,
    });

/**
 * Конструктор действия для комплексного обновления развернутости узлов.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TComplexUpdateExpandCollapseAction
 */
const complexUpdateExpandCollapse = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateExpandCollapseAction =>
    complexUpdateCreator('ExpandCollapse', prevState, nextState);

/**
 * Конструктор действия, для обновления фильтра.
 */
const complexUpdateFilter = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateFilterAction => complexUpdateCreator('Filter', prevState, nextState);

/**
 * Конструктор действия для комплексного обновления действий над записями.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TComplexUpdateItemActionsAction
 */
const complexUpdateItemActions = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateItemActionsAction =>
    complexUpdateCreator('ItemActions', prevState, nextState);

/**
 * Конструктор действия для комплексного обновления маркера.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TComplexUpdateMarkerAction
 */
const complexUpdateMarker = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateMarkerAction => complexUpdateCreator('Marker', prevState, nextState);

/**
 * Конструктор действия, для комплексного обновления ПМО.
 */
const complexUpdateOperationsPanel = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateOperationsPanelAction =>
    complexUpdateCreator('OperationsPanel', prevState, nextState);

/**
 * Конструктор действия, для комплексного обновления состояния текущего корня.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TComplexUpdateRootAction
 */
const complexUpdateRoot = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateRootAction => complexUpdateCreator('Root', prevState, nextState);

/**
 * Конструктор действия, для комплексного обновления состояния текущего поиска.
 */
const complexUpdateSearch = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateSearchAction => complexUpdateCreator('Search', prevState, nextState);

/**
 * Конструктор действия, для комплексного обновления состояния выделения.
 */
const complexUpdateSelection = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateSelectionAction =>
    complexUpdateCreator('Selection', prevState, nextState);

/**
 * Конструктор действия complexUpdateSource
 */
const complexUpdateSource = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateSourceAction => complexUpdateCreator('Source', prevState, nextState);

/**
 * Конструктор действия, для комплексного обновления записей.
 * @param prevState Предыдущее состояние
 * @param nextState Новое состояние
 */
const complexUpdateItems = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateItemsAction => complexUpdateCreator('Items', prevState, nextState);

//# endregion ==========    complexUpdate   ==========

//# region ==========   expandCollapse   ==========
/**
 * Конструктор действия для установки состояния разворота узлов.
 * @function
 * @param {TKey[]} expandedItems Раскрытые узлы
 * @param {TKey[]} collapsedItems Свернутые узлы
 * @return expandCollapse.TSetExpandCollapsedItemsAction
 * @remark Последовательный вызов атомарных setExpandedItems и setCollapsedItems приведет к двум обновлениям модели раскрытых узлов, парный экшен - только к одному.
 */
const setExpandCollapsedItems = (
    expandedItems: TKey[],
    collapsedItems: TKey[]
): expandCollapse.TSetExpandCollapsedItemsAction =>
    aCreator('setExpandCollapsedItems', {
        expandedItems,
        collapsedItems,
    });

/**
 * Конструктор действия для установки состояния развернутых узлов.
 * @function
 * @param {TKey[]} expandedItems Раскрытые узлы
 * @param {Boolean} updateExpansionModel Определяет будет ли модель раскрытых узлов пересчитана
 * @return expandCollapse.TSetExpandedItemsAction
 * @remark Атомарный экшен установки состояния развернутых узлов. Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов. Если необходимо обновить пару, лучше использовать setExpandCollapsedItems
 */
const setExpandedItems = (
    expandedItems: TKey[],
    updateExpansionModel: boolean = true
): expandCollapse.TSetExpandedItemsAction =>
    aCreator('setExpandedItems', {
        expandedItems,
        updateExpansionModel,
    });

/**
 * Конструктор действия для установки состояния свернутых узлов.
 * @function
 * @param {TKey[]} collapsedItems Свернутые узлы
 * @param {Boolean} updateExpansionModel Определяет будет ли модель раскрытых узлов пересчитана
 * @return expandCollapse.TSetCollapsedItemsAction
 * @remark Атомарный экшен установки состояния свернутых узлов. Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов. Если необходимо обновить пару, лучше использовать setExpandCollapsedItems
 */
const setCollapsedItems = (
    collapsedItems: TKey[],
    updateExpansionModel: boolean = true
): expandCollapse.TSetCollapsedItemsAction =>
    aCreator('setCollapsedItems', {
        collapsedItems,
        updateExpansionModel,
    });

/**
 * Конструктор действия для обновления модели раскрытых узлов.
 * @function
 * @return expandCollapse.TUpdateExpansionModelAction
 */
const updateExpansionModel = (): expandCollapse.TUpdateExpansionModelAction =>
    aCreator('updateExpansionModel');

/**
 * Конструктор действия для разворота родительского узла.
 */
const expandParent = (
    key: CrudEntityKey,
    markItem: boolean = true
): expandCollapse.TExpandParentAction =>
    aCreator('expandParent', {
        key,
        markItem,
    });

//# endregion ==========   expandCollapse   ==========

//# region ==========        error       ==========
/**
 * Конструктор действия, для обработки ошибки загрузки.
 * @function
 * @param {Error} error Объект ошибки
 * @param {string} direction Направление загрузки
 * @param {string|number|null} loadKey Ключ узла, для которого происходила загрузка данных
 * @param {Function} action Воспроизводит действие, которое привело к ошибке
 * @return error.THandleLoadErrorAction
 */
const handleLoadError = (
    error: Error,
    direction?: 'up' | 'down',
    loadKey?: TKey,
    action?: () => void
): error.THandleLoadErrorAction =>
    aCreator('handleLoadError', {
        error,
        direction,
        loadKey,
        action,
    });

//# endregion ==========        error       ==========

/**
 * Конструкторы действий, доступные в WEB списке.
 */
export const ListActionCreators = {
    ...AbstractListActionCreators,

    /**
     * Конструкторы действий функционала "Отметка маркером".
     * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
     */
    marker: {
        ...AbstractListActionCreators.marker,
        setMarkerVisibility,
        activateMarker,
        markNearbyItem,
        markNext,
    },

    /**
     * Конструкторы действий функционала "Отметка чекбоксом".
     * @see https://online.sbis.ru/area/02f42333-cf50-42e8-bc08-b451cc483285 Зона Kaizen
     */
    selection: {
        ...AbstractListActionCreators.selection,
        setSelectionVisibility,
        setSelection,
        updateCounter,
    },

    /**
     * Конструкторы действий функционала "Взаимодействие с панелью массовых операций".
     * @see https://online.sbis.ru/area/ccc545f6-e213-4e99-bd2c-41421c3068b6 Зона Kaizen
     */
    operationsPanel: {
        ...AbstractListActionCreators.operationsPanel,
        resetSelectionViewMode,
    },

    /**
     * Конструкторы действий функционала "Фильтрация".
     * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
     */
    filter: {
        ...AbstractListActionCreators.filter,
        setFilterDescription,
    },

    /**
     * Конструкторы действий для работы ViewModel с источником данных.
     */
    source: {
        ...AbstractListActionCreators.source,
        setSavedSourceState,
        updateSavedState,
        reload,
        newItemsReceived,
        load,
        oldSliceLoad,
        dataLoadedSuccess,
        fetch,
        requestFetch,
        initSource,
        awaitAllRequests,
        rejectLoad,
        loadOnSourceController,
        reloadOnSourceController,
        loadNodes,
        loadToDirection,
        setPreloadedItems,
        resolveStateAfterUpdateItems,
        reloadItem,
        reloadItems,
        updateHasMoreStorage,
    },
    /**
     * Конструкторы действий функционала "Разворот и сворачивание узлов".
     */
    expandCollapse: {
        ...AbstractListActionCreators.expandCollapse,
        setExpandCollapsedItems,
        setExpandedItems,
        setCollapsedItems,
        updateExpansionModel,
        expandParent,
    },

    /**
     * Конструкторы действий комплексного обновления ViewModel(Slice).
     */
    complexUpdate: {
        reduceState,
        oldBeforeApplyState,
        complexUpdateExpandCollapse,
        complexUpdateFilter,
        complexUpdateItemActions,
        complexUpdateMarker,
        complexUpdateOperationsPanel,
        complexUpdateRoot,
        complexUpdateSearch,
        complexUpdateSelection,
        complexUpdateSource,
        complexUpdateItems,
    },

    /**
     * Конструкторы действий функционала "Обработка ошибок в списке".
     */
    error: {
        handleLoadError,
    },
};
