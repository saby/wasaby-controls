import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from 'Controls/_dataFactory/interface/IListState';

export type TResetSearchAction = TAbstractAction<'resetSearch', {}>;

export const resetSearch = (): TResetSearchAction => ({
    type: 'resetSearch',
    payload: {},
});

export type TUpdateSearchAction = TAbstractAction<
    'updateSearch',
    {
        prevState: IListState;
        searchValue: IListState['searchValue'];
    }
>;

export const updateSearch = (
    prevState: IListState,
    searchValue: IListState['searchValue']
): TUpdateSearchAction => ({
    type: 'updateSearch',
    payload: {
        prevState,
        searchValue,
    },
});

export type TSearchActions = TResetSearchAction | TUpdateSearchAction;
