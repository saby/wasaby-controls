import { TAbstractListActions, TMetaDataChange } from 'Controls-DataEnv/abstractList';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';

// Экспорты для публичных типов.
export type TSetHasMoreStorageAction = TAbstractListActions.items.TSetHasMoreStorageAction;
export type TReplaceItemsAction = TAbstractListActions.items.TReplaceItemsAction;
export type TReplaceAllItemsAction = TAbstractListActions.items.TReplaceAllItemsAction;
export type TPrependItemsAction = TAbstractListActions.items.TPrependItemsAction;
export type TAppendItemsAction = TAbstractListActions.items.TAppendItemsAction;
export type THandleItemsChangedAction = TAbstractListActions.items.THandleItemsChangedAction;
export type TRemoveItemsAction = TAbstractListActions.items.TRemoveItemsAction;
export type TResetItemsAction = TAbstractListActions.items.TResetItemsAction;
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
        reason?: string;
    }
>;

/**
 * Тип действия, для установки маркера при добавлении записей.
 */
export type TOnItemsAddedAction = TAbstractAction<'onItemsAdded', {}>;

/**
 * Тип действия, для установки маркера при сбросе записей.
 */
export type TOnItemsResetAction = TAbstractAction<
    'onItemsReset',
    {
        newItems: Model[];
        oldItems: Model[];
        removedItemsIndex: number;
    }
>;

/**
 * Тип действия, для применения изменений по метаданным рекордсета.
 */
export type TSetMetaDataChangesAction = TAbstractAction<
    'setMetaDataChanges',
    {
        metaDataChanges: TMetaDataChange[];
    }
>;

/**
 * Тип действий функционала "Работа с рекордсетом записей", доступные в WEB списке.
 */
export type TAnyItemsAction =
    | TAbstractListActions.items.TAnyItemsAction
    | TOnItemsRemovedAction
    | TOnAllItemsReplacedAction
    | TOnItemsAddedAction
    | TOnItemsResetAction
    | TSetMetaDataChangesAction;
