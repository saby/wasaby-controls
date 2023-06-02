/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_calendar/MonthList/MonthListItem';
import { Base as dateUtils } from 'Controls/dateUtils';
import ITEM_TYPES from 'Controls/_calendar/MonthList/ItemTypes';
import { date as formatDate } from 'Types/formatter';
import { Date as WSDate, Model } from 'Types/entity';
import monthListUtils from 'Controls/_calendar/MonthList/Utils';
import { IDateRangeOptions } from 'Controls/dateRange';

interface IMonthListItemOptions extends IDateRangeOptions, IControlOptions {}

export default class MonthListItem extends Control<IMonthListItemOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date;
    protected _endValue: Date;

    protected _beforeMount(options: IMonthListItemOptions): void {
        this._updateRangeValues(
            options.startValue,
            options.endValue,
            options.itemData.item.get('date')
        );
    }

    protected _beforeUpdate(options: IMonthListItemOptions): void {
        this._updateRangeValues(
            options.startValue,
            options.endValue,
            options.itemData.item.get('date')
        );
    }

    private _updateRangeValues(
        startValue: Date,
        endValue: Date,
        monthDate: Date
    ): void {
        // Будем обновлять startValue и endValue только в тех месяцах, в которых происходит выбор
        const startDate = dateUtils.getStartOfMonth(startValue);
        const endDate = dateUtils.getEndOfMonth(endValue);
        if (
            (startValue === null || (startValue && startDate <= monthDate)) &&
            (endValue === null || (endValue && monthDate <= endDate))
        ) {
            this._startValue = startValue;
            this._endValue = endValue;
        } else {
            this._startValue = undefined;
            this._endValue = undefined;
        }
    }

    protected _getTemplate(data: Model): TemplateFunction {
        switch (data.get('type')) {
            case ITEM_TYPES.header:
                return this._options.itemHeaderTemplate;
            case ITEM_TYPES.stub:
                return this._options.stubTemplate;
            default:
                return this._options.itemTemplate;
        }
    }

    protected _formatMonth(date: Date): string {
        return date ? formatDate(date, formatDate.FULL_MONTH) : '';
    }

    protected _getMonth(year: number, month: number): Date {
        return new WSDate(year, month, 1);
    }

    protected _dateToDataString(date: Date): string {
        return monthListUtils.dateToId(date);
    }
}
