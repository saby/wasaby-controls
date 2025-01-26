import { RecordSet } from 'Types/collection';
import { items } from '../types';
import aCreator from './_actionCreator';
import { TItemsChange, TListChangeSource } from '../../interface/IAbstractListState';
import { TAddItemsMap, TReplaceItemsMap } from '../types/_itemTypes';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';
import { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';

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
 * Конструктор действия для сброса записей.
 */
export const resetItems = (
    newItems: Model[],
    oldItems: Model[],
    removedItemsIndex: number,
    changeSource: TListChangeSource
): items.TResetItemsAction =>
    aCreator('resetItems', {
        newItems,
        oldItems,
        removedItemsIndex,
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
): items.TRemoveItemsAction =>
    aCreator('removeItems', {
        keys,
        index,
        changeSource,
        reason,
    });

/**
 * Конструктор действия, для установки имени поля записи, в котором хранится первичный ключ.
 * @function
 * @param {String} keyProperty Имя поля записи, в котором хранится первичный ключ
 * @return items.TChangeKeyPropertyAction
 */
export const changeKeyProperty = (keyProperty: string): items.TChangeKeyPropertyAction =>
    aCreator('changeKeyProperty', {
        keyProperty,
    });

/**
 * Конструктор действия, для замены метаданных.
 * @function
 * @param {unknown} metaData Метаданные
 * @return items.TReplaceMetaDataAction
 */
export const replaceMetaData = (metaData: unknown): items.TReplaceMetaDataAction =>
    aCreator('replaceMetaData', {
        metaData,
    });

/**
 * Конструктор действия, для установки метаданных.
 * @function
 * @param {unknown} metaData Метаданные
 * @return items.TMergeMetaDataAction
 */
export const mergeMetaData = (metaData: unknown): items.TMergeMetaDataAction =>
    aCreator('mergeMetaData', {
        metaData,
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
): items.THandleItemsChangedAction =>
    aCreator('handleItemsChanged', {
        prevItems,
        nextItems,
    });

/**
 * Конструктор действия, для применения изменений записей с коллекции.
 */
export const setItemsChanges = (itemsChanges: TItemsChange[]): items.TSetItemsChangesAction => ({
    type: 'setItemsChanges',
    payload: {
        itemsChanges,
    },
});
