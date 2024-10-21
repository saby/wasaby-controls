/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListState } from '../../interface/IListState';
import type { filter } from '../types';

/**
 * Конструктор действия, для установки структуры фильтров.
 */
export const setFilterDescription = ({
    filterDescription,
    countFilterValue,
    countFilterLinkedNames,
    countFilterValueConverter,
    countFilterUserPeriods,
    countFilterPeriodType,
}: Pick<
    filter.IFilterState,
    | 'filterDescription'
    | 'countFilterValue'
    | 'countFilterLinkedNames'
    | 'countFilterValueConverter'
    | 'countFilterUserPeriods'
    | 'countFilterPeriodType'
>): filter.TSetFilterDescriptionAction => ({
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

/**
 * Конструктор действия, для обновления фильтра.
 */
export const updateFilter = (
    prevState: IListState,
    {
        filter,
        countFilterValue,
        filterDescription,
        countFilterValueConverter,
        countFilterLinkedNames,
    }: filter.IFilterState
): filter.TUpdateFilterAction => ({
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
