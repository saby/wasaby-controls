import { RecordSet } from 'Types/collection';
import { items } from '../types';
import aCreator from './_actionCreator';
import { TListChangeSource } from 'Controls-DataEnv/newLists/_abstractList/interface/IAbstractListState';
import { TAddItemsMap, TReplaceItemsMap } from '../types/_itemTypes';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';
import { CrudEntityKey } from 'Types/source';

/**
 * Конструктор действия, для замены всех записей.
 */
export const replaceAllItems = (newItems: RecordSet): items.TReplaceAllItemsAction =>
    aCreator('replaceAllItems', {
        items: newItems,
    });

/**
 * Конструктор действия, для добавления записей после указанных ключей.
 */
export const appendItems = (
    itemsMap: TAddItemsMap,
    changeSource: TListChangeSource
): items.TAppendItemsAction =>
    aCreator('appendItems', {
        items: itemsMap,
        changeSource,
    });

/**
 * Конструктор действия, для добавления записей перед указанными ключами.
 */
export const prependItems = (
    itemsMap: TAddItemsMap,
    changeSource: TListChangeSource
): items.TPrependItemsAction =>
    aCreator('prependItems', {
        items: itemsMap,
        changeSource,
    });

/**
 * Конструктор действия, для замены записей.
 */
export const replaceItems = (
    itemsMap: TReplaceItemsMap,
    changeSource: TListChangeSource
): items.TReplaceItemsAction =>
    aCreator('replaceItems', {
        items: itemsMap,
        changeSource,
    });

/**
 *
 */
export const setHasMoreStorage = (
    hasMoreStorage: IHasMoreStorage
): items.TSetHasMoreStorageAction =>
    aCreator('setHasMoreStorage', {
        hasMoreStorage,
    });

/**
 * Конструктор действия, для удаления записей.
 * @function
 * @param {CrudEntityKey[]} keys Ключи записей
 * @param {Number} index Индекс записи
 * @param {TListChangeSource} changeSource Источник ченджа
 * @param {string | undefined} reason Причина удаления элементов
 * @return items.TRemoveItemsAction
 */
export const removeItems = (
    keys: CrudEntityKey[],
    index: number,
    changeSource: TListChangeSource,
    reason?: string
): items.TRemoveItemsAction => ({
    type: 'removeItems',
    payload: {
        keys,
        index,
        changeSource,
        reason,
    },
});

/**
 * Конструктор действия, для установки имени поля записи, в котором хранится первичный ключ.
 * @function
 * @param {String} keyProperty Имя поля записи, в котором хранится первичный ключ
 * @return items.TChangeKeyPropertyAction
 */
export const changeKeyProperty = (keyProperty: string): items.TChangeKeyPropertyAction => ({
    type: 'changeKeyProperty',
    payload: {
        keyProperty,
    },
});

/**
 * Конструктор действия, для замены метаданных.
 * @function
 * @param {unknown} metaData Метаданные
 * @return items.TReplaceMetaDataAction
 */
export const replaceMetaData = (metaData: unknown): items.TReplaceMetaDataAction => ({
    type: 'replaceMetaData',
    payload: {
        metaData,
    },
});

/**
 * Конструктор действия, для установки метаданных.
 * @function
 * @param {unknown} metaData Метаданные
 * @return items.TMergeMetaDataAction
 */
export const mergeMetaData = (metaData: unknown): items.TMergeMetaDataAction => ({
    type: 'mergeMetaData',
    payload: {
        metaData,
    },
});

/**
 * Конструктор действия для уведомления об удалении записей.
 * @function
 * @param {TKey[]} keys Ключи удаленных элементов
 * @param {string | undefined} reason Причина удаления элементов
 * @return items.THandleRemovedItemsAction
 */
export const handleRemovedItems = (
    keys: CrudEntityKey[],
    reason?: string
): items.THandleRemovedItemsAction => ({
    type: 'handleRemovedItems',
    payload: {
        keys,
        reason,
    },
});

/**
 * Конструктор действия, для уведомления об изменении записей.
 * @function
 * @param {RecordSet | undefined} prevItems Прошлые элементы
 * @param {RecordSet | undefined} nextItems Новые элементы
 * @return items.THandleItemsChangedAction
 */
export const handleItemsChanged = (
    prevItems?: RecordSet,
    nextItems?: RecordSet
): items.THandleItemsChangedAction => ({
    type: 'handleItemsChanged',
    payload: {
        prevItems,
        nextItems,
    },
});
