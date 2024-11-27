import type { IListState } from '../../interface/IListState';
import type { items } from '../types';
import type { TKey } from 'Controls-DataEnv/interface';
import type { RecordSet } from 'Types/collection';

/**
 * Конструктор действия, для комплексного обновления записей.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return items.TComplexUpdateItemsAction
 */
export const complexUpdateItems = (
    prevState: IListState,
    nextState: IListState
): items.TComplexUpdateItemsAction => ({
    type: 'complexUpdateItems',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Конструктор действия для уведомления об удалении записей.
 * @function
 * @param {TKey[]} keys Ключи удаленных элементов
 * @param {string} reason Причина удаления элементов
 * @return items.THandleRemovedItemsAction
 */
export const handleRemovedItems = (
    keys: TKey[],
    reason: string
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
