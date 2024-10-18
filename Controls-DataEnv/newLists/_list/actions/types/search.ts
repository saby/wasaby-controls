/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';

// Экспорты для публичных типов.
export type TResetSearchAction = TAbstractListActions.search.TResetSearchAction;
export type TStartSearchAction = TAbstractListActions.search.TStartSearchAction;
// Экспорты для публичных типов.

export type TUpdateSearchAction = TAbstractAction<
    'updateSearch',
    {
        prevState: IListState;
        searchValue: IListState['searchValue'];
    }
>;

export type TAnySearchAction = TAbstractListActions.search.TAnySearchAction | TUpdateSearchAction;
