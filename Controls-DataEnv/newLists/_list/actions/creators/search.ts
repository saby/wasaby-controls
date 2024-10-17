/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AbstractListActionCreators } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { search } from '../types';

export const resetSearch = AbstractListActionCreators.search.resetSearch;

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

export type TSearchActions = search.TResetSearchAction | search.TUpdateSearchAction;
