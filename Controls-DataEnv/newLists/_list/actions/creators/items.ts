/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListState } from '../../interface/IListState';
import type { items } from '../types';

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
