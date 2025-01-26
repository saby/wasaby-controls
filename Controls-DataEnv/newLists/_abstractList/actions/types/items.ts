import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';

import { TItemsChange, TListChangeSource } from '../../interface/IAbstractListState';
import { TAddItemsMap, TReplaceItemsMap } from './_itemTypes';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';
import type { Model } from 'Types/entity';

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
 * Тип действия, для сброса записей.
 */
export type TResetItemsAction = TAbstractAction<
    'resetItems',
    {
        newItems: Model[];
        oldItems: Model[];
        removedItemsIndex: number;
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
 * Тип действия, для применения изменений записей с коллекции.
 */
export type TSetItemsChangesAction = TAbstractAction<
    'setItemsChanges',
    {
        itemsChanges: TItemsChange[];
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
    | THandleItemsChangedAction
    | TRemoveItemsAction
    | TResetItemsAction
    | TChangeKeyPropertyAction
    | TReplaceMetaDataAction
    | TMergeMetaDataAction
    | TSetItemsChangesAction;
