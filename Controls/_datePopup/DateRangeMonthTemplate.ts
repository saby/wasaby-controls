import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopup/DateRangeMonthTemplate';
import { date as formatDate } from 'Types/formatter';
import { Base as dateUtils } from 'Controls/dateUtils';
import { IDateRangeOptions } from 'Controls/dateRange';

interface IDateRangeMonthTemplateOptions extends IControlOptions, IDateRangeOptions {
    monthSelectionProcessing: boolean;
    date: Date;
    selectionBaseValue?: Date;
}

export default class DateRangeMonthTemplate extends Control<IDateRangeMonthTemplateOptions> {
    protected _template: TemplateFunction = template;

    protected _monthMouseEnterHandler(_: Event, value: Date): void {
        this._notify('itemMouseEnter', [value], { bubbling: true });
    }

    protected _monthMouseLeaveHandler(_: Event, value: Date): void {
        this._notify('itemMouseLeave', [value], { bubbling: true });
    }

    protected _scrollToMonth(_: Event, year: number, month: number): void {
        this._notify('scrollToMonth', [year, month], { bubbling: true });
    }

    private _increaseYear(date: Date): Date {
        const nextYear = date.getFullYear() + 1;
        return new Date(nextYear, 0, 1);
    }

    protected _onYearClick(_: Event, date: Date): void {
        // добавляем 1 год потому что последний месяц будет рендерить заголовок следующего года
        const nextYearDate = this._increaseYear(date);
        this._notify('yearClick', [nextYearDate]);
    }

    protected _onYearEnter(_: Event, date: Date): void {
        const nextYearDate = this._increaseYear(date);
        this._notify('yearEnter', [nextYearDate]);
    }

    protected _onYearLeave(): void {
        this._notify('yearLeave');
    }

    protected _isMonthSelectedStart(value: Date): boolean {
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
            (dateUtils.isDatesEqual(this._options.selectionBaseValue, value) && selectedStart) ||
            (!this._options.monthSelectionProcessing && selectedStart)
        );
    }

    protected _isMonthSelectedEnd(value: Date): boolean {
        const endValue = dateUtils.getStartOfMonth(this._options.endValue);
        const selectedEnd = dateUtils.isDatesEqual(endValue, value);
        if (this._options.startValue > this._options.endValue) {
            return false;
        }
        if (
            !dateUtils.isStartOfMonth(this._options.startValue) ||
            !dateUtils.isEndOfMonth(this._options.endValue)
        ) {
            return false;
        }
        if (
            dateUtils.isDatesEqual(this._options.startValue, endValue) &&
            this._options.monthSelectionProcessing
        ) {
            return false;
        }
        return (
            (dateUtils.isDatesEqual(this._options.selectionBaseValue, value) && selectedEnd) ||
            (!this._options.monthSelectionProcessing && selectedEnd)
        );
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
