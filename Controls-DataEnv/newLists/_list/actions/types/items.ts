import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TKey } from 'Controls-DataEnv/interface';
import type { RecordSet } from 'Types/collection';

/**
 * Тип действия, для комплексного обновления записей.
 */
export type TComplexUpdateItemsAction = TAbstractComplexUpdateAction<'Items'>;

/**
 * Тип действия, для комплексного обновления записей.
 */
export type THandleRemovedItemsAction = TAbstractAction<
    'handleRemovedItems',
    {
        keys: TKey[];
        reason: string;
    }
>;

/**
 * Тип действия, для обработки события измененния записей.
 */
export type THandleItemsChangedAction = TAbstractAction<
    'handleItemsChanged',
    {
        prevItems?: RecordSet;
        nextItems?: RecordSet;
    }
>;

/**
 * Тип действий функционала "Работа с рекордсетом записей", доступные в WEB списке.
 */
export type TAnyItemsAction =
    | TComplexUpdateItemsAction
    | THandleRemovedItemsAction
    | THandleItemsChangedAction;
