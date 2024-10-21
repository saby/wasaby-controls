/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TFilter } from 'Controls-DataEnv/interface';
import type { filter } from '../types';

/**
 * Конструктор действия, установки нового фильтра.
 * @function
 * @param {TFilter} filter Фильтр
 * @return filter.TSetFilterAction
 */
export const setFilter = (filter: TFilter): filter.TSetFilterAction => ({
    type: 'setFilter',
    payload: {
        filter,
    },
});
