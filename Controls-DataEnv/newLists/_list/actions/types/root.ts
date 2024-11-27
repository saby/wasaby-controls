import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';

//# region Экспорты для публичных типов.
/**
 * Тип действия, для смены текущего корня иерархии.
 */
export type TSetRootAction = TAbstractListActions.root.TSetRootAction;
//# endregion Экспорты для публичных типов.

/**
 * Тип действия, для комплексного обновления состояния текущего корня.
 */
export type TComplexUpdateRootAction = TAbstractComplexUpdateAction<'Root'>;

/**
 * Тип действий функционала "Проваливание", доступные в WEB списке.
 * @see https://online.sbis.ru/area/f77b7722-2f7f-4c69-b029-a00480c0d33b Зона Kaizen
 */
export type TAnyRootAction = TAbstractListActions.root.TAnyRootAction | TComplexUpdateRootAction;
