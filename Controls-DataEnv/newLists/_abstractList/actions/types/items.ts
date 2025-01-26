import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';

import { TListChangeSource } from 'Controls-DataEnv/newLists/_abstractList/interface/IAbstractListState';
import { TAddItemsMap, TReplaceItemsMap } from './_itemTypes';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';

/**
 * Тип действия, для замены всех записей.
 */
export type TReplaceAllItemsAction = TAbstractAction<
    'replaceAllItems',
    {
        items: RecordSet;
    }
>;

/**
 * Тип действия, для замены записей.
 */
export type TReplaceItemsAction = TAbstractAction<
    'replaceItems',
    {
        items: TReplaceItemsMap;
        changeSource: TListChangeSource;
    }
>;

/**
 * Тип действия, для добавления записей перед указанными ключами.
 */
export type TPrependItemsAction = TAbstractAction<
    'prependItems',
    {
        items: TAddItemsMap;
        changeSource: TListChangeSource;
    }
>;

/**
 * Тип действия, для добавления записей после указанных ключей.
 */
export type TAppendItemsAction = TAbstractAction<
    'appendItems',
    {
        items: TAddItemsMap;
        changeSource: TListChangeSource;
    }
>;

/**
 * Тип действия, для удаления записей.
 */
export type TRemoveItemsAction = TAbstractAction<
    'removeItems',
    {
        keys: CrudEntityKey[];
        index: number;
        changeSource: TListChangeSource;
        reason?: string;
    }
>;

/**
 *
 */
export type TSetHasMoreStorageAction = TAbstractAction<
    'setHasMoreStorage',
    {
        hasMoreStorage: IHasMoreStorage;
    }
>;

/**
 * Тип действия, для установки имени поля записи, в котором хранится первичный ключ.
 */
export type TChangeKeyPropertyAction = TAbstractAction<
    'changeKeyProperty',
    {
        keyProperty: string;
    }
>;

/**
 * Тип действия, для замены метаданных.
 */
export type TReplaceMetaDataAction = TAbstractAction<
    'replaceMetaData',
    {
        metaData: unknown;
    }
>;

/**
 * Тип действия, для установки метаданных.
 */
export type TMergeMetaDataAction = TAbstractAction<
    'mergeMetaData',
    {
        metaData: unknown;
    }
>;

/**
 * Тип действия, для комплексного обновления записей.
 */
export type THandleRemovedItemsAction = TAbstractAction<
    'handleRemovedItems',
    {
        keys: CrudEntityKey[];
        reason?: string;
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
 * Тип действий функционала "Работа с рекордсетом записей", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnyItemsAction =
    | TSetHasMoreStorageAction
    | TReplaceItemsAction
    | TReplaceAllItemsAction
    | TPrependItemsAction
    | TAppendItemsAction
    | THandleRemovedItemsAction
    | THandleItemsChangedAction
    | TRemoveItemsAction
    | TChangeKeyPropertyAction
    | TReplaceMetaDataAction
    | TMergeMetaDataAction;
