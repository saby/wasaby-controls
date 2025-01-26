import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

//# region Экспорты для публичных типов.
/**
 * Тип действия для обновления модели, описывающей операции над записями.
 */
export type TUpdateItemActionsMapAction =
    TAbstractListActions.itemActions.TUpdateItemActionsMapAction;
//# endregion Экспорты для публичных типов.

/**
 * Тип действия для комплексного обновления действий над записью.
 */
export type TComplexUpdateItemActionsAction = TAbstractComplexUpdateAction<'ItemActions'>;
/**
 * Тип действий функционала "Работа с действиями над записью", доступные в WEB списке.
 */
export type TAnyItemActionsAction =
    | TAbstractListActions.itemActions.TAnyItemActionsAction
    | TComplexUpdateItemActionsAction;
