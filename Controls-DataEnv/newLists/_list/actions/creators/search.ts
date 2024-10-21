/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListState } from '../../interface/IListState';
import type { search } from '../types';

/**
 * Конструктор действия, для комплексного обновления состояния текущего поиска.
 */
export const updateSearch = (
    prevState: IListState,
    searchValue: IListState['searchValue']
): search.TUpdateSearchAction => ({
    type: 'updateSearch',
    payload: {
        prevState,
        searchValue,
    },
});
