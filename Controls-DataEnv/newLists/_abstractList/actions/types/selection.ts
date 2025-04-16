import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TSingleAxisDirection } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';
import type { TSelectionModel } from '../../interface/IAbstractListStateParts/ISelectionState';

/**
 * Тип действия, для отметки записи с помощью множественного выделения.
 */
export type TSelectAction = TAbstractAction<
    'select',
    {
        key: CrudEntityKey;
        direction?: TSingleAxisDirection;
        isRangeSelection?: boolean;
    }
>;

/**
 * Тип действия, для отметки всех записей.
 */
export type TSelectAllAction = TAbstractAction<'selectAll', {}>;

/**
 * Тип действия, для инверртирования состояния выбора записей.
 */
export type TInvertSelectionAction = TAbstractAction<'invertSelection', {}>;

/**
 * Тип действия, для сброса текущей отметки записей.
 */
export type TResetSelectionAction = TAbstractAction<'resetSelection', {}>;

/**
 * Тип действия, для установки новой модели выделенных элементов.
 */
export type TSetSelectionModelAction = TAbstractAction<
    'setSelectionModel',
    {
        selectionModel: TSelectionModel;
    }
>;

/**
 * Тип действия, для установки количества выделенных элементов.
 */
export type TSetSelectionCount = TAbstractAction<
    'setSelectionCount',
    {
        count: number | null;
    }
>;

/**
 * Тип действий функционала "Отметка чекбоксом", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/02f42333-cf50-42e8-bc08-b451cc483285 Зона Kaizen
 */
export type TAnySelectionAction =
    | TInvertSelectionAction
    | TSelectAllAction
    | TSelectAction
    | TResetSelectionAction
    | TSetSelectionModelAction
    | TSetSelectionCount;
