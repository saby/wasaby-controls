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
