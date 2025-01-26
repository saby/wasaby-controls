import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TKey } from 'Controls-DataEnv/interface';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';

// Экспорты для публичных типов.
export type TSetHasMoreStorageAction = TAbstractListActions.items.TSetHasMoreStorageAction;
export type TReplaceItemsAction = TAbstractListActions.items.TReplaceItemsAction;
export type TReplaceAllItemsAction = TAbstractListActions.items.TReplaceAllItemsAction;
export type TPrependItemsAction = TAbstractListActions.items.TPrependItemsAction;
export type TAppendItemsAction = TAbstractListActions.items.TAppendItemsAction;
export type THandleRemovedItemsAction = TAbstractListActions.items.THandleRemovedItemsAction;
export type THandleItemsChangedAction = TAbstractListActions.items.THandleItemsChangedAction;
export type TRemoveItemsAction = TAbstractListActions.items.TRemoveItemsAction;
export type TChangeKeyPropertyAction = TAbstractListActions.items.TChangeKeyPropertyAction;
export type TReplaceMetaDataAction = TAbstractListActions.items.TReplaceMetaDataAction;
export type TMergeMetaDataAction = TAbstractListActions.items.TMergeMetaDataAction;
// Экспорты для публичных типов.

/**
 * Тип действия, для установки маркера при замене всех записей.
 */
export type TOnAllItemsReplacedAction = TAbstractAction<
    'onAllItemsReplaced',
    {
        items: RecordSet;
        prevStateMarkedKey?: TKey;
    }
>;

/**
 * Тип действия, для установки маркера при удалении записей.
 */
export type TOnItemsRemovedAction = TAbstractAction<
    'onItemsRemoved',
    {
        index: number;
        keys: CrudEntityKey[];
        actionArray: TAbstractListActions.items.TAnyItemsAction[];
        prevStateMarkedKey?: TKey;
    }
>;

/**
 * Тип действия, для установки маркера при добавлении записей.
 */
export type TOnItemsAddedAction = TAbstractAction<
    'onItemsAdded',
    {
        actionArray: TAbstractListActions.items.TAnyItemsAction[];
        prevStateMarkedKey?: TKey;
    }
>;

/**
 * Тип действия, для комплексного обновления записей.
 */
export type TComplexUpdateItemsAction = TAbstractComplexUpdateAction<'Items'>;

/**
 * Тип действий функционала "Работа с рекордсетом записей", доступные в WEB списке.
 */
export type TAnyItemsAction =
    | TAbstractListActions.items.TAnyItemsAction
    | TOnItemsRemovedAction
    | TOnAllItemsReplacedAction
    | TOnItemsAddedAction
    | TComplexUpdateItemsAction;
