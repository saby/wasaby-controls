import type { search } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для сброса текущего поиска.
 * @function
 * @return search.TResetSearchAction
 */
export const resetSearch = (): search.TResetSearchAction => aCreator('resetSearch');

/**
 * Конструктор действия, для начала поиска.
 * @function
 * @param {string} searchValue Поисковое значение
 * @return search.TStartSearchAction
 */
export const startSearch = (searchValue: string): search.TStartSearchAction =>
    aCreator('startSearch', {
        searchValue,
    });
