/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import * as React from 'react';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_compactDatePicker/List';
import { Utils as DateControlsUtils } from 'Controls/dateRange';
import 'css!Controls/compactDatePicker';
import getDayTemplate from 'Controls/_compactDatePicker/dayTemplate';
import { MonthViewDayTemplate } from 'Controls/calendar';
import CompactMonthModel from './MonthModel';
import { getFormattedCaption } from 'Controls/_compactDatePicker/Utils';
import { IDisplayedRangesOptions } from 'Controls/interface';
import { Base as dateUtil } from 'Controls/dateUtils';

interface ICompactDatePickerOptions
    extends IControlOptions,
        IDisplayedRangesOptions {
    position: Date;
    startValue: Date | null;
    endValue: Date | null;
    topShadowVisibility: string;
}

export default class List extends Control<ICompactDatePickerOptions> {
    protected _template: TemplateFunction = template;
    protected _baseDayTemplate: React.FunctionComponent;
    protected _weekdaysCaptions: string =
        DateControlsUtils.getWeekdaysCaptions();

    protected _monthViewModel: CompactMonthModel = CompactMonthModel;

    protected _beforeMount(options: ICompactDatePickerOptions): void {
        this._baseDayTemplate = getDayTemplate(
            options.dayTemplate || MonthViewDayTemplate,
            options.rangeModel,
            options.dayTemplateOptions
        );
    }

    protected _beforeUpdate(options: ICompactDatePickerOptions): void {
        if (options.dayTemplateOptions !== this._options.dayTemplateOptions) {
            this._baseDayTemplate = getDayTemplate(
                options.dayTemplate || MonthViewDayTemplate,
                options.rangeModel,
                options.dayTemplateOptions
            );
        }
    }

    protected _positionChangedHandler(event: Event, position: Date): void {
        this._notify('positionChanged', [position]);
    }

    protected _isLastMonth(date: Date): boolean {
        if (!this._options.displayedRanges) {
            return false;
        }
        const displayedRanges = this._options.displayedRanges;
        const amountOfRanges = displayedRanges.length;
        let lastRange;
        if (this._options.order === 'desc') {
            lastRange = this._options.displayedRanges[0][0];
        } else {
            lastRange = this._options.displayedRanges[amountOfRanges - 1][1];
        }
        if (!lastRange) {
            return false;
        }
        return (
            lastRange.getFullYear() === date.getFullYear() &&
            lastRange.getMonth() === date.getMonth()
        );
    }

    protected _getFormattedCaption(date: Date): string {
        // Рисуем заголовок текущего месяца в футоре другого месяца. Таким образом позиция будет меняться только когда
        // пользователь подскроллит прямо к месяцу с ячейками дней. Это нужно для того, чтобы заголовок в шапке менялся
        // только тогда, когда заголовка у месяца уже не видно. Иначе визуально заголовки будут дублироваться.
        const delta = this._options.order === 'desc' ? -1 : 1;
        const captionDate = new Date(
            date.getFullYear(),
            date.getMonth() + delta
        );
        return getFormattedCaption(captionDate);
    }

    protected _proxyEvent(event: Event, eventName: string): void {
        this._notify(eventName, Array.prototype.slice.call(arguments, 2));
    }

    protected _monthViewItemClickHandler(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }

    protected _isSelectedStart(value: Date): boolean {
        return dateUtil.isDatesEqual(this._options.rangeModel.startValue, value);
    }

    protected _isSelectedEnd(value: Date): boolean {
        return dateUtil.isDatesEqual(this._options.rangeModel.endValue, value);
    }
}
