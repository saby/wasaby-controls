/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TFilter } from 'Controls-DataEnv/interface';
import type { IListState } from '../../interface/IListState';
import type { IFilterItem, IUserPeriod } from 'Controls/filter';
import type { QueryWhereExpression } from 'Types/source';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';

// FIX: Убрать этот тип. Минимум - из export, максимум - вообще.
export interface IFilterState {
    filter?: TFilter;
    filterDescription?: IFilterItem[];
    countFilterValue?: string | Date[];
    countFilterLinkedNames?: string[];
    countFilterValueConverter?: (
        value: string | Date | Date[],
        filterItem: IFilterItem,
        filterDescription: IFilterItem[]
    ) => QueryWhereExpression<unknown>;
    countFilterUserPeriods?: IUserPeriod[];
    countFilterPeriodType?: string;
}

// Экспорты для публичных типов.
export type TSetFilterAction = TAbstractListActions.filter.TSetFilterAction;
// Экспорты для публичных типов.

export type TSetFilterDescriptionAction = TAbstractAction<
    'setFilterDescription',
    Pick<
        IFilterState,
        | 'filterDescription'
        | 'countFilterValue'
        | 'countFilterLinkedNames'
        | 'countFilterValueConverter'
        | 'countFilterUserPeriods'
        | 'countFilterPeriodType'
    >
>;

export type TUpdateFilterAction = TAbstractAction<
    'updateFilter',
    {
        prevState: IListState;
    } & IFilterState
>;

export type TAnyFilterAction =
    | TAbstractListActions.filter.TAnyFilterAction
    | TSetFilterDescriptionAction
    | TUpdateFilterAction;
