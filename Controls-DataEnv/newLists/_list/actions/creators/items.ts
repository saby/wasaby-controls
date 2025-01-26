import type { items } from '../types';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import { TMetaDataChange } from 'Controls-DataEnv/abstractList';
import aCreator from './_actionCreator';
import type { Model } from 'Types/entity';

/**
 * Конструктор действия, для установки маркера при замене всех записей.
 * @param items
 * @param prevStateMarkedKey Состояние маркера до удаления записей
 */
export const onAllItemsReplaced = (items: RecordSet): items.TOnAllItemsReplacedAction =>
    aCreator('onAllItemsReplaced', {
        items,
    });

/**
 * Конструктор действия, для установки маркера при удалении записей.
 */
export const onItemsRemoved = (
    index: number,
    keys: CrudEntityKey[],
    reason?: string
): items.TOnItemsRemovedAction => ({
    type: 'onItemsRemoved',
    payload: {
        index,
        keys,
        reason,
    },
});

/**
 * Конструктор действия, для установки маркера при добавлении записей.
 */
export const onItemsAdded = (): items.TOnItemsAddedAction => ({
    type: 'onItemsAdded',
    payload: {},
});

/**
 * Конструктор действия, для установки маркера при сбросе записей.
 */
export const onItemsReset = (
    newItems: Model[],
    oldItems: Model[],
    removedItemsIndex: number
): items.TOnItemsResetAction => ({
    type: 'onItemsReset',
    payload: {
        newItems,
        oldItems,
        removedItemsIndex,
    },
});

/**
 * Конструктор действия, для применения изменений по метаданным рекордсета.
 */
export const setMetaDataChanges = (
    metaDataChanges: TMetaDataChange[]
): items.TSetMetaDataChangesAction => ({
    type: 'setMetaDataChanges',
    payload: {
        metaDataChanges,
    },
});
