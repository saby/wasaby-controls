import type { operationsPanel } from '../types';
import aCreator from './_actionCreator';
import type { IAbstractListState } from '../../interface/IAbstractListState';

/**
 * Конструктор действия, для открытия панели массовых операций.
 * @function
 * @return operationsPanel.TOpenOperationsPanelAction
 */
export const openOperationsPanel = (): operationsPanel.TOpenOperationsPanelAction =>
    aCreator('openOperationsPanel');

/**
 * Конструктор действия, для закрытия панели массовых операций.
 * @function
 * @return operationsPanel.TCloseOperationsPanelAction
 */
export const closeOperationsPanel = (): operationsPanel.TCloseOperationsPanelAction =>
    aCreator('closeOperationsPanel');

/**
 * Конструктор действия для установки выделенных элементов в ПМО.
 */
export const setListCommandsSelection = (
    listCommandsSelection: IAbstractListState['listCommandsSelection']
): operationsPanel.TSetListCommandsSelectionAction =>
    aCreator('setListCommandsSelection', { listCommandsSelection });

/**
 * Конструктор действия, для обновления состояния выделения в ПМО.
 */
export const updateOperationsSelection = (): operationsPanel.TUpdateOperationsSelectionAction => ({
    type: 'updateOperationsSelection',
    payload: {},
});

/**
 * Конструктор действия, чтобы отобрать отмеченные записи.
 */
export const showSelected = (): operationsPanel.TShowSelectedAction => aCreator('showSelected');
/**
 * Конструктор действия, чтобы показать все записи.
 */
export const showAll = (): operationsPanel.TShowAllAction => aCreator('showAll');

/**
 * Конструктор действия для установки режима отображения выбора через ПМО.
 */
export const setSelectionViewMode = (
    selectionViewMode: IAbstractListState['selectionViewMode']
): operationsPanel.TSetSelectionViewModeAction =>
    aCreator('setSelectionViewMode', { selectionViewMode });
