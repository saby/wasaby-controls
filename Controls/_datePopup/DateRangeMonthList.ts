import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopup/DateRangeMonthList';
import { Base as dateUtils } from 'Controls/dateUtils';
import * as monthHeaderTmpl from 'wml!Controls/_datePopup/DateRangeMonthHeaderTemplate';
import { detection } from 'Env/Env';
import { IDateRangeOptions } from 'Controls/dateRange';
import { clsx } from 'clsx';

interface IDateRangeMonthListOptions extends IControlOptions, IDateRangeOptions {
    monthSelectionProcessing?: boolean;
    position: Date;
}

export default class DateRangeMonthList extends Control<IDateRangeMonthListOptions> {
    protected _template: TemplateFunction = template;
    protected _monthHeaderTmpl: TemplateFunction = monthHeaderTmpl;
    protected _hoveredYear: Date | null = null;

    protected _isMobile: TemplateFunction = detection.isMobilePlatform;

    protected _beforeMount(): void {
        this._getMonthSelectionClass = this._getMonthSelectionClass.bind(this);
        this._getMonthHoverClass = this._getMonthHoverClass.bind(this);
    }

    protected _getMonthSelectionClass(value: Date): string {
        if (
            !dateUtils.isStartOfMonth(this._options.startValue) ||
            !dateUtils.isEndOfMonth(this._options.endValue)
        ) {
            return '';
        }
        let className = '';
        const isSelected = (startValue: Date): boolean => {
            const endValue = dateUtils.getEndOfMonth(startValue);
            return this._options.startValue <= startValue && this._options.endValue >= endValue;
        };

        const startOfMonth = value;
        const isCurrentMonthSelected = isSelected(startOfMonth);

        const startOfNextMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1);
        const nextMonthSelected =
            isSelected(startOfNextMonth) && value.getFullYear() === startOfNextMonth.getFullYear();

        const startOfPrevMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1);
        const prevMonthSelected =
            isSelected(startOfPrevMonth) && value.getFullYear() === startOfPrevMonth.getFullYear();

        if (isCurrentMonthSelected) {
            className += ' controls-PeriodDialog-DateRangeItem__months-btn_selected';
            if (!prevMonthSelected && !nextMonthSelected) {
                className += ' controls-PeriodDialog-DateRangeItem__months-btn_selected-start-end';
            } else if (!prevMonthSelected) {
                className += ' controls-PeriodDialog-DateRangeItem__months-btn_selected-start';
            } else if (!nextMonthSelected) {
                className += ' controls-PeriodDialog-DateRangeItem__months-btn_selected-end';
            }
        }

        return className;
    }

    protected _yearClick(_: Event, date: Date) {
        this._notify('yearSelection', undefined, { bubbling: true });
        this._notify(
            'itemClick',
            [
                date,
                {
                    selectionType: 'quantum',
                    quantum: {
                        years: [1],
                    },
                },
            ],
            { bubbling: true }
        );
    }

    protected _yearEnter(_: Event, date: Date) {
        this._hoveredYear = date;
    }

    protected _yearLeave() {
        this._hoveredYear = null;
    }

    protected _getMonthHoverClass(date: Date, hoveredYear: Date): string {
        if (!this._options?.monthSelectionProcessing && !hoveredYear) {
            return 'controls-PeriodDialog-DateRangeItem__months-btn_hover';
        }

        if (date.getFullYear() !== hoveredYear?.getFullYear()) {
            return '';
        }

        return clsx('controls-PeriodDialog-DateRangeItem__months-btn_multi-hover', {
            'controls-PeriodDialog-DateRangeItem__months-btn_multi-hover-start':
                date.getMonth() === 0,
            'controls-PeriodDialog-DateRangeItem__months-btn_multi-hover-end':
                date.getMonth() === 11,
        });
    }

    protected _positionChangedHandler(event: Event, position: Date): void {
        this._notify('positionChanged', [position]);
    }
}
