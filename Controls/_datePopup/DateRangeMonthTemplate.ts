import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopup/DateRangeMonthTemplate';
import { date as formatDate } from 'Types/formatter';
import { Base as dateUtils } from 'Controls/dateUtils';
export default class DateRangeMonthTemplate extends Control {
    protected _template: TemplateFunction = template;

    protected _monthMouseEnterHandler(event: Event, value: Date): void {
        this._notify('itemMouseEnter', [value], { bubbling: true });
    }

    protected _monthMouseLeaveHandler(event: Event, value: Date): void {
        this._notify('itemMouseLeave', [value], { bubbling: true });
    }

    protected _isMonthSelectedStart(value: Date): boolean {
        if (this._options.startValue > this._options.endValue) {
            return false;
        }
        if (
            !dateUtils.isStartOfMonth(this._options.startValue) ||
            !dateUtils.isEndOfMonth(this._options.endValue)
        ) {
            return false;
        }
        return dateUtils.isDatesEqual(value, this._options.startValue);
    }

    protected _isMonthSelectedEnd(value: Date): boolean {
        if (this._options.startValue > this._options.endValue) {
            return false;
        }
        if (
            !dateUtils.isStartOfMonth(this._options.startValue) ||
            !dateUtils.isEndOfMonth(this._options.endValue)
        ) {
            return false;
        }
        const endValue = dateUtils.getEndOfMonth(value);
        return dateUtils.isDatesEqual(endValue, this._options.endValue);
    }

    protected _dateToId(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    }

    protected _formatMonth(month: number): string {
        // Берем любой год, т.к. нам важен только месяц для форматирования.
        const year = 2000;
        return formatDate(new Date(year, month), 'MMMM');
    }
}
