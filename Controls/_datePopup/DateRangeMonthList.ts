import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopup/DateRangeMonthList';
import { EventUtils } from 'UI/Events';
import { Base as dateUtils } from 'Controls/dateUtils';
import * as monthHeaderTmpl from 'wml!Controls/_datePopup/DateRangeMonthHeaderTemplate';

export default class DateRangeMonthList extends Control {
    protected _template: TemplateFunction = template;
    protected _monthHeaderTmpl: TemplateFunction = monthHeaderTmpl;

    protected _beforeMount(): void {
        this._getMonthSelectionClass = this._getMonthSelectionClass.bind(this);
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

    protected _positionChangedHandler(event: Event, position: Date): void {
        this._notify('positionChanged', [position]);
    }
}
