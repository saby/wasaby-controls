import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import { operationsPanel } from 'Controls-DataEnv/newLists/_list/actions/types';

//# region Экспорты для публичных типов.
/**
 * Тип действия, для открытия панели массовых операций.
 */
export type TOpenOperationsPanelAction =
    TAbstractListActions.operationsPanel.TOpenOperationsPanelAction;
/**
 * Тип действия, для закрытия панели массовых операций.
 */
export type TCloseOperationsPanelAction =
    TAbstractListActions.operationsPanel.TCloseOperationsPanelAction;
/**
 * Тип действия, для обновления состояния выделения в ПМО.
 */
export type TUpdateOperationsSelectionAction =
    TAbstractListActions.operationsPanel.TUpdateOperationsSelectionAction;
/**
 * Тип действия для установки выделенных элементов в ПМО.
 */
export type TSetListCommandsSelectionAction =
    TAbstractListActions.operationsPanel.TSetListCommandsSelectionAction;
/**
 * Тип действия для установки режима отображения выбора через ПМО.
 */
export type TSetSelectionViewModeAction =
    TAbstractListActions.operationsPanel.TSetSelectionViewModeAction;
//# endregion Экспорты для публичных типов.

/**
 * Тип действия, для сброса режима выбора через ПМО.
 */
export type TResetSelectionViewModeAction = TAbstractAction<'resetSelectionViewMode', {}>;

/**
 * Тип действия, для комплексного обновления ПМО.
 */
export type TComplexUpdateOperationsPanelAction = TAbstractComplexUpdateAction<'OperationsPanel'>;

/**
 * Тип действий функционала "Взаимодействие с панелью массовых операций", доступные в WEB списке.
 * @see https://online.sbis.ru/area/ccc545f6-e213-4e99-bd2c-41421c3068b6 Зона Kaizen
 */
export type TAnyOperationsPanelAction =
    | TAbstractListActions.operationsPanel.TAnyOperationsPanelAction
    | operationsPanel.TResetSelectionViewModeAction
    | operationsPanel.TComplexUpdateOperationsPanelAction;
