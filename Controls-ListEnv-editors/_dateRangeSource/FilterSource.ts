import { Date as EntityDate } from 'Types/entity';
import { Base as DateBaseUtils, Range } from 'Controls/dateUtils';
import { RecordSet } from 'Types/collection';
import {
    defaultDateRangeType,
    defaultDateRange,
    defaultType,
} from 'Controls-ListEnv-meta/DateRangeFilterItemType';
import { IFilterItem } from 'Controls/filter';
import * as translate from 'i18n!Controls-ListEnv-editors';

const dateRangeFilterName = 'DateRange';
const MIN_RANGE_ITEMS = ['day', 'month', 'quarter', 'year'];
const COMMON_PERIOD_ITEMS = [
    {
        id: 'all',
        title: translate('За весь период'),
    },
    {
        id: 'today',
        title: translate('За сегодня'),
    },
    {
        id: 'yesterday',
        title: translate('За вчера'),
    },
    {
        id: 'tomorrow',
        title: translate('Завтра'),
    },
];

const DEFAULT_PERIOD_ITEMS = [
    ...COMMON_PERIOD_ITEMS,
    {
        id: 'week',
        title: translate('За неделю'),
    },
    {
        id: 'month',
        title: translate('За месяц'),
    },
    {
        id: 'quarter',
        title: translate('За квартал'),
    },
    {
        id: 'halfyear',
        title: translate('За полгода'),
    },
    {
        id: 'year',
        title: translate('За год'),
    },
];
const DEFAULT_LAST_PERIOD_ITEMS = [
    ...COMMON_PERIOD_ITEMS,
    {
        id: 'week',
        title: translate('За последнюю неделю'),
    },
    {
        id: 'month',
        title: translate('За последний месяц'),
    },
    {
        id: 'quarter',
        title: translate('За последний квартал'),
    },
    {
        id: 'halfyear',
        title: translate('За последние полгода'),
    },
    {
        id: 'year',
        title: translate('За последний год'),
    },
];
export const weekDays = 7;
export const month = 1;
export const quarter = 3;
export const halfYear = 6;
export const year = 12;

export function shiftDateByMonths(monthsCount: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsCount);
    return date;
}

/**
 * Формирует дефолтный период для фильтра
 * @returns {Date[]}
 */
export function prepareDateResetValues(
    defaultPeriod: string,
    minRange: string,
    type: string
): Date[] {
    const resultType = type || defaultType;
    if (resultType === defaultType) {
        return prepareCurrentDateResetValues(defaultPeriod, minRange);
    } else {
        return prepareLastDateResetValues(defaultPeriod, minRange);
    }
}

function prepareCurrentDateResetValues(defaultPeriod: string, minRange: string): Date[] {
    let result = prepareCommonDateResetValues(defaultPeriod, minRange);
    const today = new Date();

    if (!result && defaultPeriod === 'week') {
        result = [
            new EntityDate(DateBaseUtils.getStartOfWeek(today)),
            new EntityDate(DateBaseUtils.getEndOfWeek(today)),
        ];
    } else if (
        !result &&
        (defaultPeriod === 'month' || (defaultPeriod === 'arbitrary' && minRange === 'month'))
    ) {
        result = [
            new EntityDate(DateBaseUtils.getStartOfMonth(today)),
            new EntityDate(DateBaseUtils.getEndOfMonth(today)),
        ];
    } else if (
        !result &&
        (defaultPeriod === 'quarter' || (defaultPeriod === 'arbitrary' && minRange === 'quarter'))
    ) {
        result = [
            new EntityDate(DateBaseUtils.getStartOfQuarter(today)),
            new EntityDate(DateBaseUtils.getEndOfQuarter(today)),
        ];
    } else if (
        !result &&
        (defaultPeriod === 'halfyear' || (defaultPeriod === 'arbitrary' && minRange === 'halfyear'))
    ) {
        result = [
            new EntityDate(DateBaseUtils.getStartOfHalfyear(today)),
            new EntityDate(DateBaseUtils.getEndOfHalfyear(today)),
        ];
    }
    if (
        !result &&
        (defaultPeriod === 'year' || (defaultPeriod === 'arbitrary' && minRange === 'year'))
    ) {
        result = [
            new EntityDate(DateBaseUtils.getStartOfYear(today)),
            new EntityDate(DateBaseUtils.getEndOfYear(today)),
        ];
    }

    return result;
}

function prepareLastDateResetValues(defaultPeriod: string, minRange: string): Date[] {
    let result = prepareCommonDateResetValues(defaultPeriod, minRange);
    const today = new Date();

    if (!result && defaultPeriod === 'week') {
        result = [
            new EntityDate(Range.shiftPeriodByDays(today, today, -weekDays)[0]),
            new EntityDate(today),
        ];
    } else if (
        !result &&
        (defaultPeriod === 'month' || (defaultPeriod === 'arbitrary' && minRange === 'month'))
    ) {
        result = [new EntityDate(shiftDateByMonths(month)), new EntityDate(today)];
    } else if (
        !result &&
        (defaultPeriod === 'quarter' || (defaultPeriod === 'arbitrary' && minRange === 'quarter'))
    ) {
        result = [new EntityDate(shiftDateByMonths(quarter)), new EntityDate(today)];
    } else if (
        !result &&
        (defaultPeriod === 'halfyear' || (defaultPeriod === 'arbitrary' && minRange === 'halfyear'))
    ) {
        result = [new EntityDate(shiftDateByMonths(halfYear)), new EntityDate(today)];
    } else if (
        !result &&
        (defaultPeriod === 'year' || (defaultPeriod === 'arbitrary' && minRange === 'year'))
    ) {
        result = [new EntityDate(shiftDateByMonths(year)), new EntityDate(today)];
    }

    return result;
}

function prepareCommonDateResetValues(defaultPeriod: string, minRange: string): Date[] {
    let result;

    if (defaultPeriod === 'today' || (defaultPeriod === 'arbitrary' && minRange === 'day')) {
        result = [new EntityDate(), new EntityDate()];
    } else if (defaultPeriod === 'yesterday') {
        const startDate = new EntityDate();
        const endDate = new EntityDate();
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);

        result = [startDate, endDate];
    } else if (defaultPeriod === 'tomorrow') {
        const startDate = new EntityDate();
        const endDate = new EntityDate();
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        result = [startDate, endDate];
    }

    return result;
}

export const getDefaultPeriodItems = (
    items: { id: string }[],
    dateRangeType: string[]
): object[] => {
    return items.filter((item) => {
        return dateRangeType?.includes(item.id);
    });
};

export function descriptionToValueConverter({ value, editorOptions }: IFilterItem): object {
    let dateValue;
    const minRange = editorOptions?.minRange as string;
    const type = editorOptions?.type;
    if (value !== 'all') {
        dateValue =
            typeof value === 'string' ? prepareDateResetValues(value, minRange, type) : value;
    }

    return {
        date: dateValue && dateValue[0],
        dateTo: dateValue && dateValue[1],
    };
}

export function getFilterSource(filterItem: object, historyId?: string) {
    const defaultPeriod = filterItem.defaultDateRange || defaultDateRange;
    let minRange = filterItem.minRange?.replace('Arbitrary', '');
    const type = filterItem.type;
    const arrows = filterItem.arrows;
    const arrowsPosition = filterItem.position === 'left' ? 'right' : 'left';
    const resetDateValues = prepareDateResetValues(defaultPeriod, minRange, type);
    const dateRangeType = filterItem.dateRangeType || defaultDateRangeType;
    const periodItems = type === 'last' ? DEFAULT_LAST_PERIOD_ITEMS : DEFAULT_PERIOD_ITEMS;
    const isOnlyArbitrary = dateRangeType.length === 1 && dateRangeType[0] === 'arbitrary';
    if (!minRange && arrows) {
        const availableDateRange = dateRangeType.filter((rangeType) =>
            MIN_RANGE_ITEMS.includes(rangeType)
        );
        const isOnlyMinRangeItems = availableDateRange.length === dateRangeType.length;
        minRange = isOnlyMinRangeItems ? availableDateRange[0] : minRange;
    }

    const defaultTextValue =
        defaultPeriod === 'all' ? translate('За весь период') : translate('За период');
    const textValue =
        resetDateValues && defaultPeriod !== 'arbitrary'
            ? periodItems.find((item) => item.id === defaultPeriod)?.title
            : defaultTextValue;

    const defaultPeriodItems = new RecordSet({
        rawData: getDefaultPeriodItems(periodItems, dateRangeType),
        keyProperty: 'id',
    });

    const resetValue = arrows
        ? {
              resetValue: resetDateValues,
          }
        : {};

    return {
        historyId,
        name: dateRangeFilterName,
        value: defaultPeriod !== 'arbitrary' && !arrows ? defaultPeriod : resetDateValues,
        ...resetValue,
        textValue,
        viewMode: 'frequent',
        descriptionToValueConverter,
        editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
        type: arrows || isOnlyArbitrary ? 'dateRange' : 'dateMenu',
        filterChangedCallback: 'Controls-ListEnv-editors/dateRangeSource:filterChangedCallback',
        editorOptions: {
            items: defaultPeriodItems,
            displayProperty: 'title',
            keyProperty: 'id',
            nextArrowVisible: arrows,
            prevArrowVisible: arrows,
            prevArrowAlignment: arrowsPosition,
            nextArrowAlignment: arrowsPosition,
            datePopupType:
                (arrows || isOnlyArbitrary) &&
                minRange &&
                minRange !== 'day' &&
                minRange !== 'month'
                    ? 'shortDatePicker'
                    : '',
            minRange,
            type,
            editorMode: ['month', 'quarter', 'year'].includes(minRange) ? 'Lite' : 'Selector',
            selectionType: 'range',
            periodItemVisible: dateRangeType.includes('arbitrary'),
            chooseYears: dateRangeType.includes('year') || minRange === 'year',
            chooseHalfyears: false,
            chooseQuarters: dateRangeType.includes('quarter') || (minRange && minRange !== 'year'),
            chooseMonths:
                dateRangeType.includes('month') ||
                (minRange && minRange !== 'year' && minRange !== 'quarter'),
        },
    };
}
