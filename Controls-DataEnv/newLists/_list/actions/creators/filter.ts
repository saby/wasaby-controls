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
