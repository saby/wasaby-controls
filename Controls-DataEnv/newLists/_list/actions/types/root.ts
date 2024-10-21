/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls-DataEnv/interface';

// Экспорты для публичных типов.
/**
 * Тип действия, для смены текущего корня иерархии.
 */
export type TSetRootAction = TAbstractListActions.root.TSetRootAction;
// Экспорты для публичных типов.

/**
 * Тип действия, для комплексного обновления состояния текущего корня.
 */
export type TComplexUpdateRootAction = TAbstractAction<
    'complexUpdateRoot',
    {
        prevState: IListState;
        root?: TKey;
    }
>;

/**
 * Тип действий функционала "Проваливание", доступные в WEB списке.
 * @see https://online.sbis.ru/area/f77b7722-2f7f-4c69-b029-a00480c0d33b Зона Kaizen
 */
export type TAnyRootAction = TAbstractListActions.root.TAnyRootAction | TComplexUpdateRootAction;
