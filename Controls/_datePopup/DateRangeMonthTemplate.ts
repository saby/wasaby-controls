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

    protected _scrollToMonth(event: Event, year: number, month: number): void {
        this._notify('scrollToMonth', [year, month], { bubbling: true });
    }

    protected _isMonthSelectedStart(value: Date): boolean {
        const endValue = dateUtils.getStartOfMonth(this._options.endValue);
        const selectedStart = dateUtils.isDatesEqual(this._options.startValue, value);
        if (this._options.startValue > this._options.endValue) {
            return false;
        }
        if (
            !dateUtils.isStartOfMonth(this._options.startValue) ||
            !dateUtils.isEndOfMonth(this._options.endValue)
        ) {
            return false;
        }

        return (
                dateUtils.isDatesEqual(this._options.selectionBaseValue, value) &&
                selectedStart ||
                !this._options.monthSelectionProcessing &&
                selectedStart
            ) &&
            (!dateUtils.isDatesEqual(this._options.startValue, endValue) || this._options.monthSelectionProcessing);
    }

    protected _isMonthSelectedEnd(value: Date): boolean {
        const endValue = dateUtils.getStartOfMonth(this._options.endValue);
        const selectedEnd= dateUtils.isDatesEqual(endValue, value);
        if (this._options.startValue > this._options.endValue) {
            return false;
        }
        if (
            !dateUtils.isStartOfMonth(this._options.startValue) ||
            !dateUtils.isEndOfMonth(this._options.endValue)
        ) {
            return false;
        }
        return (
                dateUtils.isDatesEqual(this._options.selectionBaseValue, value) &&
                selectedEnd ||
                !this._options.monthSelectionProcessing &&
                selectedEnd
            ) &&
            !dateUtils.isDatesEqual(this._options.startValue, endValue);
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
