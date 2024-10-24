/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { search } from '../types';

/**
 * Конструктор действия, для сброса текущего поиска.
 * @function
 * @return search.TResetSearchAction
 */
export const resetSearch = (): search.TResetSearchAction => ({
    type: 'resetSearch',
    payload: {},
});

/**
 * Конструктор действия, для начала поиска.
 * @function
 * @param {string} searchValue Поисковое значение
 * @return search.TStartSearchAction
 */
export const startSearch = (searchValue: string): search.TStartSearchAction => ({
    type: 'startSearch',
    payload: {
        searchValue,
    },
});
