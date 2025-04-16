import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { IAbstractListState } from '../../interface/IAbstractListState';

/**
 * Тип действия, для открытия панели массовых операций.
 */
export type TOpenOperationsPanelAction = TAbstractAction<'openOperationsPanel', {}>;

/**
 * Тип действия, для закрытия панели массовых операций.
 */
export type TCloseOperationsPanelAction = TAbstractAction<'closeOperationsPanel', {}>;

/**
 * Тип действия для установки выделенных элементов в ПМО.
 */
export type TSetListCommandsSelectionAction = TAbstractAction<
    'setListCommandsSelection',
    {
        listCommandsSelection: IAbstractListState['listCommandsSelection'];
    }
>;

/**
 * Тип действия, для обновления состояния выделения в ПМО.
 */
export type TUpdateOperationsSelectionAction = TAbstractAction<'updateOperationsSelection', {}>;

/**
 * Тип действия, чтобы отобрать отмеченные записи.
 */
export type TShowSelectedAction = TAbstractAction<'showSelected', {}>;
/**
 * Тип действия, чтобы показать все записи.
 */
export type TShowAllAction = TAbstractAction<'showAll', {}>;

/**
 * Тип действия для установки режима отображения выбора через ПМО.
 */
export type TSetSelectionViewModeAction = TAbstractAction<
    'setSelectionViewMode',
    { selectionViewMode: IAbstractListState['selectionViewMode'] }
>;

/**
 * Тип действий функционала "Взаимодействие с панелью массовых операций", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/ccc545f6-e213-4e99-bd2c-41421c3068b6 Зона Kaizen
 */
export type TAnyOperationsPanelAction =
    | TOpenOperationsPanelAction
    | TCloseOperationsPanelAction
    | TSetListCommandsSelectionAction
    | TUpdateOperationsSelectionAction
    | TShowSelectedAction
    | TShowAllAction
    | TSetSelectionViewModeAction;
