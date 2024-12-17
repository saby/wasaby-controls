/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from '../../interface/IListState';
import { IFilterItem, IUserPeriod } from 'Controls/filter';
import type { TFilter } from 'Controls/interface';
import { QueryWhereExpression } from 'Types/source';

interface IFilterState {
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

export type TSetFilterDescriptionAction = TAbstractAction<
    'setFilterDescription',
    Pick<
        IFilterState,
        | 'filterDescription'
        | 'countFilterValue'
        | 'countFilterLinkedNames'
        | 'countFilterValueConverter'
    >
>;

export const setFilterDescription = ({
    filterDescription,
    countFilterValue,
    countFilterLinkedNames,
    countFilterValueConverter,
    countFilterUserPeriods,
    countFilterPeriodType,
}: Pick<
    IFilterState,
    | 'filterDescription'
    | 'countFilterValue'
    | 'countFilterLinkedNames'
    | 'countFilterValueConverter'
    | 'countFilterUserPeriods'
    | 'countFilterPeriodType'
>): TSetFilterDescriptionAction => ({
    type: 'setFilterDescription',
    payload: {
        filterDescription,
        countFilterValue,
        countFilterLinkedNames,
        countFilterValueConverter,
        countFilterUserPeriods,
        countFilterPeriodType,
    },
});

export type TSetFilterAction = TAbstractAction<
    'setFilter',
    {
        filter: IFilterState['filter'];
    }
>;

export const setFilter = (filter: IFilterState['filter']): TSetFilterAction => ({
    type: 'setFilter',
    payload: {
        filter,
    },
});

export type TUpdateFilterAction = TAbstractAction<
    'updateFilter',
    {
        prevState: IListState;
    } & IFilterState
>;

export const updateFilter = (
    prevState: IListState,
    {
        filter,
        countFilterValue,
        filterDescription,
        countFilterValueConverter,
        countFilterLinkedNames,
    }: IFilterState
): TUpdateFilterAction => ({
    type: 'updateFilter',
    payload: {
        prevState,
        filter,
        countFilterValue,
        filterDescription,
        countFilterValueConverter,
        countFilterLinkedNames,
    },
});

export type TFilterActions = TSetFilterAction | TSetFilterDescriptionAction | TUpdateFilterAction;
