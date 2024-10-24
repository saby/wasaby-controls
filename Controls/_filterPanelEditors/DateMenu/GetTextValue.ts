import * as rk from 'i18n!Controls';
import { BY_PERIOD_KEY, IDateMenuOptions } from 'Controls/_filterPanelEditors/DateMenu/IDateMenu';
import { getDatesByFilterItem } from 'Controls/filter';
import { RecordSet } from 'Types/collection';
import getFormattedDateRangeCaption from '../GetFormattedDateRangeCaption';

// При выборе этих периодов дата не задается, выводим константой.
const excludedPeriods = ['today', 'yesterday'];

export const EMPTY_CAPTION = rk('Весь период');

function getCaption(options: IDateMenuOptions, value: Date | Date[], _date?: Date): string {
    const startValue = value instanceof Array ? value[0] : value;
    const endValue = value instanceof Array ? value[1] : value;
    if (!startValue && !endValue) {
        return options.extendedCaption || '';
    }

    if (startValue instanceof Date || endValue instanceof Date) {
        return (options.captionFormatter || getFormattedDateRangeCaption)(
            startValue,
            endValue,
            '',
            _date
        );
    }
}

export function getDates(value, props): [Date, Date] {
    return getDatesByFilterItem({
        name: props.name,
        value,
        editorOptions: {
            periodType: props.periodType,
            userPeriods: props.userPeriods,
            _date: props._date,
        },
    });
}

export default function getTextValue(
    options: IDateMenuOptions,
    items: RecordSet,
    selectedKey: string,
    value?: Date | Date[]
): string {
    let textValue;
    let dates = value;
    if (!excludedPeriods.includes(selectedKey)) {
        if (!value) {
            dates = getDates(selectedKey, options);
        }
        textValue = getCaption(options, dates || selectedKey, options._date);
    }
    if (!textValue && items) {
        const item = items.getRecordById(selectedKey);

        if (item && selectedKey !== BY_PERIOD_KEY) {
            return item.get(options.displayProperty);
        } else {
            return options.emptyText || EMPTY_CAPTION;
        }
    }
    return textValue;
}
