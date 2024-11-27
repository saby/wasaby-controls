import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { CrudEntityKey } from 'Types/source';

/**
 * Тип действия, для отметки записи с помощью множественного выделения.
 */
export type TSelectAction = TAbstractAction<
    'select',
    {
        key: CrudEntityKey;
        // FIXME: Тип должен импортироваться, но именно тип, не enum.
        direction?: 'backward' | 'forward';
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
        selectionModel: Map<CrudEntityKey, boolean | null>;
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
    | TSetSelectionModelAction;
