import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

import type { TKey } from 'Controls-DataEnv/interface';
import type { IListState } from '../../interface/IListState';

//# region Экспорты для публичных типов.
/**
 * Тип действия, для отметки записи с помощью множественного выделения.
 */
export type TSelectAction = TAbstractListActions.selection.TSelectAction;
/**
 * Тип действия, для сброса текущей отметки записей.
 */
export type TResetSelectionAction = TAbstractListActions.selection.TResetSelectionAction;
/**
 * Тип действия, для отметки всех записей.
 */
export type TSelectAllAction = TAbstractListActions.selection.TSelectAllAction;
/**
 * Тип действия, для инверртирования состояния выбора записей.
 */
export type TInvertSelectionAction = TAbstractListActions.selection.TInvertSelectionAction;
/**
 * Тип действия, для установки новой модели выделенных элементов.
 */
export type TSetSelectionModelAction = TAbstractListActions.selection.TSetSelectionModelAction;
/**
 * Тип действия, для установки количества выделенных элементов.
 */
export type TSetSelectionCount = TAbstractListActions.selection.TSetSelectionCount;
//# endregion Экспорты для публичных типов.

/**
 * Тип действия, для установки видимости множественного выделения.
 */
export type TSetSelectionVisibilityAction = TAbstractAction<
    'setSelectionVisibility',
    {
        visibility: IListState['multiSelectVisibility'];
    }
>;

/**
 * Тип действия, для установки ключей выделенных записей.
 */
export type TSetSelectionAction = TAbstractAction<
    'setSelection',
    {
        selectedKeys: TKey[];
        excludedKeys: TKey[];
    }
>;

/**
 * Тип действия, для обновления счетчика выделенных записей
 */
export type TUpdateCounterAction = TAbstractAction<'updateCounter', {}>;

/**
 * Тип действий функционала "Отметка чекбоксом", доступные в WEB списке.
 * @see https://online.sbis.ru/area/02f42333-cf50-42e8-bc08-b451cc483285 Зона Kaizen
 */
export type TAnySelectionAction =
    | TAbstractListActions.selection.TAnySelectionAction
    | TSetSelectionVisibilityAction
    | TSetSelectionAction
    | TUpdateCounterAction;
