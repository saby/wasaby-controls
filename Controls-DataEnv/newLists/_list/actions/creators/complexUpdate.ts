import type { IListState } from '../../interface/IListState';
import { complexUpdate } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для сборки нового состояния.
 * @function
 * @param {IListState} prevState Прошлое состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TReduceStateAction
 */
export const reduceState = (
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
export const oldBeforeApplyState = (
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
export const complexUpdateExpandCollapse = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateExpandCollapseAction =>
    aCreator('complexUpdateExpandCollapse', {
        prevState,
        nextState,
    });

/**
 * Конструктор действия, для обновления фильтра.
 */
export const complexUpdateFilter = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateFilterAction =>
    aCreator('complexUpdateFilter', {
        prevState,
        nextState,
    });

/**
 * Конструктор действия для комплексного обновления действий над записями.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TComplexUpdateItemActionsAction
 */
export const complexUpdateItemActions = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateItemActionsAction => ({
    type: 'complexUpdateItemActions',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Конструктор действия для комплексного обновления маркера.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TComplexUpdateMarkerAction
 */
export const complexUpdateMarker = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateMarkerAction => ({
    type: 'complexUpdateMarker',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Конструктор действия, для комплексного обновления ПМО.
 */
export const complexUpdateOperationsPanel = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateOperationsPanelAction => ({
    type: 'complexUpdateOperationsPanel',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Конструктор действия, для комплексного обновления состояния текущего корня.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TComplexUpdateRootAction
 */
export const complexUpdateRoot = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateRootAction => ({
    type: 'complexUpdateRoot',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Конструктор действия, для комплексного обновления состояния текущего поиска.
 */
export const complexUpdateSearch = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateSearchAction =>
    aCreator('complexUpdateSearch', {
        prevState,
        nextState,
    });

/**
 * Конструктор действия, для комплексного обновления состояния выделения.
 */
export const complexUpdateSelection = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateSelectionAction =>
    aCreator('complexUpdateSelection', {
        prevState,
        nextState,
    });

/**
 * Конструктор действия complexUpdateSource
 */
export const complexUpdateSource = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateSourceAction => ({
    type: 'complexUpdateSource',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Конструктор действия, для комплексного обновления записей.
 * @param prevState Предыдущее состояние
 * @param nextState Новое состояние
 */
export const complexUpdateItems = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TComplexUpdateItemsAction =>
    aCreator('complexUpdateItems', {
        prevState,
        nextState,
    });
