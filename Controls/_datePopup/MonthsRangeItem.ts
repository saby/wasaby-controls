/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopup/MonthsRangeItem';
import { Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { MonthModel as modelViewModel } from 'Controls/compactDatePicker';
import {
    IDateRangeSelectable,
    IRangeSelectableOptions,
    IDateRangeSelectableOptions,
    IDateRangeOptions,
} from 'Controls/dateRange';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import rangeSelectionUtils from 'Controls/_datePopup/RangeSelection';
import { Base as dateUtils } from 'Controls/dateUtils';
import { isRangeEnabled } from 'Controls/_datePopup/Utils/RangeEnabled';
import { MonthViewDayTemplate } from 'Controls/calendar';
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import getDayTemplate from './getDayTemplate';
import { IDayAvailableOptions } from 'Controls/calendar';

interface IMonthsRangeItemOptions
    extends IControlOptions,
        IRangeSelectableOptions,
        IDateRangeSelectableOptions,
        IDateRangeOptions,
        IDayAvailableOptions {
    position: Date;
    isDayAvailable: Function;
}

/**
 * Item for the period selection component of multiple months.
 *
 * @class Controls/_datePopup/MonthsRangeItem
 * @extends UI/Base:Control
 *
 * @author Ковалев Г.Д.
 * @private
 */

const SELECTION_VIEW_TYPES = {
    days: 'days',
    months: 'months',
};

const EDGE_MONTHS_RIGHT = [2, 5, 8, 11];
const EDGE_MONTHS_LEFT = [0, 3, 6, 9];

const BORDER_RADIUS_CLASSES = {
    bottomRight: ' controls-PeriodDialog_item_border-bottom-right-radius',
    topRight: ' controls-PeriodDialog_item_border-top-right-radius',
    bottomLeft: ' controls-PeriodDialog_item_border-bottom-left-radius',
    topLeft: ' controls-PeriodDialog_item_border-top-left-radius',
};

const BORDER_CLASSES = {
    top: ' controls-PeriodDialog_item_border-top',
    bottom: ' controls-PeriodDialog_item_border-bottom',
    left: ' controls-PeriodDialog_item_border-left',
    right: ' controls-PeriodDialog_item_border-right',
};

const MONTHS_RANGE_CSS_CLASS_PREFIX: string = 'controls-PeriodDialog-MonthsRange__';

export default class MonthsRangeItem extends Control<IMonthsRangeItemOptions> {
    protected _template: TemplateFunction = template;

    protected _dayTemplate: TemplateFunction;
    protected _monthViewModel: modelViewModel = modelViewModel;
    protected _SELECTION_VIEW_TYPES: string = SELECTION_VIEW_TYPES;
    protected _FULL_HALF_YEAR: string = formatDate.FULL_HALF_YEAR;
    protected _FULL_QUARTER: string = formatDate.FULL_QUARTER;
    protected _quarterHovered: number = null;
    protected _halfYearHovered: number = null;
    protected _months: WSDate[];
    protected _yearStructure: object[] = [
        {
            name: 'I',
            startMonth: 0,
            quarters: [
                {
                    name: 'I',
                    startMonth: 0,
                },
                {
                    name: 'II',
                    startMonth: 3,
                },
            ],
        },
        {
            name: 'II',
            startMonth: 6,
            quarters: [
                {
                    name: 'III',
                    startMonth: 6,
                },
                {
                    name: 'IV',
                    startMonth: 9,
                },
            ],
        },
    ];
    protected _formatDate: Function = formatDate;
    protected _quarterSelectionEnabled: boolean = true;
    protected _monthsSelectionEnabled: boolean = true;
    private _halfyearSelectionEnabled: boolean = true;
    private _yearSelectionEnabled: boolean = true;
    private _mouseEnterHandled: boolean = false;

    protected _hovered: boolean = false;
    protected _beforeMount(options: IMonthsRangeItemOptions): void {
        this._dayTemplate = getDayTemplate(MonthViewDayTemplate);
        const year = options.date?.getFullYear();
        if (
            options.readOnly ||
            options.selectionType === IDateRangeSelectable.SELECTION_TYPES.single ||
            options.selectionType === IDateRangeSelectable.SELECTION_TYPES.disable
        ) {
            this._monthsSelectionEnabled = false;
            this._quarterSelectionEnabled = false;
            this._halfyearSelectionEnabled = false;
            this._yearSelectionEnabled = false;
        } else if (options.ranges && !isEmpty(options.ranges)) {
            this._monthsSelectionEnabled = 'months' in options.ranges;
            this._quarterSelectionEnabled = 'quarters' in options.ranges;
            this._halfyearSelectionEnabled = 'halfyears' in options.ranges;
            this._yearSelectionEnabled = 'years' in options.ranges;
        }
        this._months = [];
        const monthsInYear = 12;
        for (let i = 0; i < monthsInYear; i++) {
            this._months.push(new WSDate(year, i, 1));
        }
    }

    protected _proxyEvent(event: IMonthsRangeItemOptions): void {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    }

    protected _onQuarterClick(event: Date, date: Date): void {
        if (this._isQuarterEnabled(date)) {
            const ranges = this._calculateRangeSelectedCallback(
                date,
                dateUtils.getEndOfQuarter(date)
            );
            this._notify('fixedPeriodClick', ranges);
        }
    }

    protected _onQuarterMouseOver(event: Event, index: number): void {
        if (!this._mouseEnterHandled) {
            this._onQuarterMouseEnter(event, index);
        }
    }

    protected _onQuarterMouseEnter(event: Event, index: number): void {
        this._mouseEnterHandled = true;
        if (this._quarterSelectionEnabled) {
            this._quarterHovered = index;
        }
    }

    protected _onQuarterMouseLeave(): void {
        if (this._quarterSelectionEnabled) {
            this._quarterHovered = null;
        }
    }

    protected _isSelected(index: number, type: string): boolean {
        let startValue;
        let endValue;
        if (type === 'halfyear') {
            startValue = this._months[index * 6];
            endValue = dateUtils.getEndOfHalfyear(startValue);
        }
        if (type === 'quarter') {
            startValue = this._months[index * 3];
            endValue = dateUtils.getEndOfQuarter(startValue);
        }
        return (
            dateUtils.isDatesEqual(startValue, this._options.startValue) &&
            dateUtils.isDatesEqual(endValue, this._options.endValue)
        );
    }

    protected _onHalfYearClick(event: Event, date: Date): void {
        if (this._isHalfYearEnabled(date)) {
            const ranges = this._calculateRangeSelectedCallback(
                date,
                dateUtils.getEndOfHalfyear(date)
            );
            this._notify('fixedPeriodClick', ranges);
        }
    }

    protected _onHalfYearMouseEnter(event: Event, index: number): void {
        if (this._halfyearSelectionEnabled) {
            this._halfYearHovered = index;
        }
    }

    protected _onHalfYearMouseLeave(): void {
        if (this._halfyearSelectionEnabled) {
            this._halfYearHovered = null;
        }
    }

    protected _onMonthClick(event: Event, date: Date): void {
        if (this._monthsSelectionEnabled && this._isMonthEnabled(date)) {
            this._notify('itemClick', [date]);
        } else if (
            this._options.isAdaptive &&
            !this._options.selectionProcessing &&
            this._options.monthClickable
        ) {
            this._notify('monthClick', [date]);
            event?.stopImmediatePropagation();
        }
    }

    protected _onMonthBodyClick(event: Event, date: Date): void {
        if (TouchDetect.getInstance().isTouch()) {
            return;
        }
        if (!this._options.selectionProcessing && this._options.monthClickable) {
            this._notify('monthClick', [date]);
            event?.stopImmediatePropagation();
        }
    }

    protected _onMonthMouseEnter(event: Event, date: Date): void {
        this._mouseEnterHandled = true;
        if (this._options.selectionProcessing || !this._options.monthClickable) {
            this._notify('itemMouseEnter', [date]);
        }
    }

    protected _onMonthTitleMouseLeave(event: Event, date: Date): void {
        if (!this._options.selectionProcessing && this._options.monthClickable) {
            this._notify('itemMouseLeave', [date]);
        }
    }

    protected _onMonthMouseOver(event: Event, date: Date): void {
        if (!this._mouseEnterHandled) {
            this._onMonthMouseEnter(event, date);
        }
    }

    protected _onMonthTitleMouseEnter(event: Event, date: Date): void {
        if (!this._options.selectionProcessing) {
            this._notify('itemMouseEnter', [date]);
        }
    }

    protected _mouseEnterHandler(): void {
        if (!this._options.selectionProcessing) {
            this._hovered = true;
        }
    }

    protected _mouseLeaveHandler(): void {
        this._hovered = false;
    }
    protected _onMonthMouseLeave(event: Event, date: Date): void {
        this._notify('itemMouseLeave', [date]);
    }

    protected _onMonthKeyDown(event: Event, item: Date): void {
        const itemClass = '.controls-PeriodDialog-MonthsRange__item';
        const mode = 'months';
        this._notify('itemKeyDown', [item, event.nativeEvent.keyCode, itemClass, mode]);
        // Останавливаем нативный скролл, когда управляем выбором через стрелочки клавиатуры
        event.preventDefault();
    }

    protected _dateToDataString(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    }

    protected _formatAdaptiveMonth(value: Date): string {
        return formatDate(value, 'MMM');
    }

    protected _isQuarterSelected(): boolean {
        const startValue = this._options.startValue;
        const endValue = this._options.endValue;
        const startOfQuarter = dateUtils.getStartOfQuarter(startValue);
        const endOfQuarter = dateUtils.getEndOfQuarter(startValue);
        return (
            dateUtils.isDatesEqual(startOfQuarter, startValue) &&
            dateUtils.isDatesEqual(endOfQuarter, endValue)
        );
    }

    protected _isHalfYearSelected(): boolean {
        const startValue = this._options.startValue;
        const endValue = this._options.endValue;
        const startOfHalfYear = startValue ? dateUtils.getStartOfHalfyear(startValue) : null;
        const endOfHalfYear = startValue ? dateUtils.getEndOfHalfyear(startValue) : null;
        return (
            dateUtils.isDatesEqual(startOfHalfYear, startValue) &&
            dateUtils.isDatesEqual(endOfHalfYear, endValue)
        );
    }

    protected _isSelectedStart(value: Date): boolean {
        if (this._options.yearsRangeSelectionProcessing) {
            return false;
        }
        if (this._options.startValue > this._options.endValue) {
            return false;
        }
        const startValue = dateUtils.getStartOfMonth(this._options.startValue);
        const selectedStart = dateUtils.isDatesEqual(startValue, value);

        return (
            ((dateUtils.isDatesEqual(this._options.selectionBaseValue, value) && selectedStart) ||
                (!this._options.selectionProcessing && selectedStart)) &&
            !this._isQuarterSelected() &&
            !this._isHalfYearSelected() &&
            (this._options.selectionProcessing ||
                (dateUtils.isStartOfMonth(this._options.startValue) &&
                    dateUtils.isEndOfMonth(this._options.endValue)))
        );
    }

    protected _isSelectedEnd(value: Date): boolean {
        if (this._options.yearsRangeSelectionProcessing) {
            return false;
        }
        if (this._options.startValue > this._options.endValue) {
            return false;
        }
        const startValue = dateUtils.getStartOfMonth(this._options.startValue);
        const endValue = dateUtils.getStartOfMonth(this._options.endValue);
        const selectedEnd = dateUtils.isDatesEqual(endValue, value);

        return (
            ((dateUtils.isDatesEqual(this._options.selectionBaseValue, value) && selectedEnd) ||
                (!this._options.selectionProcessing && selectedEnd)) &&
            (!dateUtils.isDatesEqual(startValue, endValue) || !this._options.selectionProcessing) &&
            !this._isQuarterSelected() &&
            !this._isHalfYearSelected() &&
            (this._options.selectionProcessing ||
                (dateUtils.isStartOfMonth(this._options.startValue) &&
                    dateUtils.isEndOfMonth(this._options.endValue)))
        );
    }

    private _isPeriodSelected(value: Date): boolean {
        return rangeSelectionUtils.isSelected(
            value,
            this._options.startValue,
            this._options.endValue,
            this._options.selectionProcessing,
            this._options.selectionBaseValue,
            this._options.selectionHoveredValue
        );
    }

    private _getAdjacentMonth(value: Date, delta: number): Date {
        return new Date(value.getFullYear(), value.getMonth() + delta);
    }

    private _getBorderClasses(
        value: Date,
        nextMonthSelected: boolean,
        previousMonthSelected: boolean
    ): string {
        const className = [];
        const hasBorder = this._quarterHovered === null || this._halfYearHovered === null;
        const monthsInQuarter = 3;
        const monthOverCurrentMonth = this._getAdjacentMonth(value, -monthsInQuarter);
        const monthUnderCurrentMonth = this._getAdjacentMonth(value, monthsInQuarter);

        const monthOverCurrentMonthSelected = this._isPeriodSelected(monthOverCurrentMonth);
        const monthUnderCurrentMonthSelected = this._isPeriodSelected(monthUnderCurrentMonth);
        const hasBorderTop = () => {
            return (
                !monthOverCurrentMonthSelected ||
                monthOverCurrentMonth.getFullYear() !== value.getFullYear()
            );
        };

        const hasBorderBottom = () => {
            return (
                !monthUnderCurrentMonthSelected ||
                monthUnderCurrentMonth.getFullYear() !== value.getFullYear()
            );
        };

        const hasBorderRight = () => {
            return EDGE_MONTHS_RIGHT.indexOf(value.getMonth()) !== -1 || !nextMonthSelected;
        };

        const hasBorderLeft = () => {
            return EDGE_MONTHS_LEFT.indexOf(value.getMonth()) !== -1 || !previousMonthSelected;
        };

        if (hasBorderTop()) {
            if (hasBorder) {
                className.push(BORDER_CLASSES.top);
            }
            if (hasBorderLeft()) {
                className.push(BORDER_RADIUS_CLASSES.topLeft);
            }
            if (hasBorderRight()) {
                className.push(BORDER_RADIUS_CLASSES.topRight);
            }
        }
        if (hasBorderBottom()) {
            if (hasBorder) {
                className.push(BORDER_CLASSES.bottom);
            }
            if (hasBorderLeft()) {
                className.push(BORDER_RADIUS_CLASSES.bottomLeft);
            }
            if (hasBorderRight()) {
                className.push(BORDER_RADIUS_CLASSES.bottomRight);
            }
        }
        if (hasBorderRight()) {
            if (hasBorder) {
                className.push(BORDER_CLASSES.right);
            }
        }
        if (hasBorderLeft()) {
            if (hasBorder) {
                className.push(BORDER_CLASSES.left);
            }
        }

        return className.join(' ');
    }

    protected _prepareItemClass(itemValue: Date): string {
        const css = [];
        const startValue = this._options.startValue;
        const endValue = this._options.endValue;
        if (this._monthsSelectionEnabled) {
            css.push(
                rangeSelectionUtils.prepareSelectionClass(
                    itemValue,
                    startValue,
                    endValue,
                    this._options.selectionProcessing,
                    this._options.selectionBaseValue,
                    this._options.selectionHoveredValue,
                    this._options.hoveredStartValue,
                    this._options.hoveredEndValue,
                    { periodQuantum: rangeSelectionUtils.PERIOD_TYPE.month }
                )
            );
        }

        if (this._options.yearsRangeSelectionProcessing) {
            css.push('controls-PeriodDialog-MonthsRange__item-unselected');
            return css.join(' ');
        }
        const nextMonth = this._getAdjacentMonth(itemValue, 1);
        const previousMonth = this._getAdjacentMonth(itemValue, -1);

        const currentMonthSelected = this._isPeriodSelected(itemValue);

        const nextMonthSelected = this._isPeriodSelected(nextMonth);
        const previousMonthSelected = this._isPeriodSelected(previousMonth);

        let quarterSelected;
        if (!startValue) {
            quarterSelected = false;
        } else {
            const startOfQuarter = dateUtils.getStartOfQuarter(startValue);
            const endOfQuarter = dateUtils.getEndOfQuarter(startValue);
            quarterSelected =
                dateUtils.isDatesEqual(startOfQuarter, startValue) &&
                dateUtils.isDatesEqual(endOfQuarter, endValue);
        }

        let halfYearSelected;
        if (!halfYearSelected) {
            halfYearSelected = false;
        } else {
            const startOfHalfYear = dateUtils.getStartOfHalfyear(startValue);
            const endOfHalfYear = dateUtils.getEndOfHalfyear(startValue);
            halfYearSelected =
                dateUtils.isDatesEqual(startOfHalfYear, startValue) &&
                dateUtils.isDatesEqual(endOfHalfYear, endValue);
        }

        if (currentMonthSelected) {
            css.push('controls-PeriodDialog-MonthsRange__item-selected');
            if (!previousMonthSelected && !quarterSelected && !halfYearSelected) {
                css.push('controls-PeriodDialog-MonthsRange__item-selected-start');
            }
            if (!nextMonthSelected && !quarterSelected && !halfYearSelected) {
                css.push('controls-PeriodDialog-MonthsRange__item-selected-end');
            }
            if (!previousMonthSelected && !nextMonthSelected) {
                // css.push('controls-PeriodDialog-MonthsRange__item-selected-selected-end');
            }
            css.push(this._getBorderClasses(itemValue, nextMonthSelected, previousMonthSelected));
        } else {
            css.push('controls-PeriodDialog-MonthsRange__item-unselected');
        }

        return css.join(' ');
    }

    protected _isYearSelected(): boolean {
        const startOfYear = this._options.date;
        const endOfYear = dateUtils.getEndOfYear(this._options.date);

        return (
            (this._options.startValue <= startOfYear || this._options.startValue === null) &&
            (endOfYear <= this._options.endValue || this._options.endValue === null)
        );
    }

    protected _getValue(value: Date, month: Date): Date {
        if (
            !this._options.selectionProcessing &&
            (!dateUtils.isStartOfMonth(this._options.startValue) ||
                !dateUtils.isEndOfMonth(this._options.endValue)) &&
            (this._options.startValue > month ||
                this._options.endValue < dateUtils.getEndOfMonth(month))
        ) {
            return value;
        }
    }

    protected _getItemDataQA(itemValue: Date): string {
        let dataQA;
        const startValue = this._options.startValue;
        const endValue = this._options.endValue;
        if (
            rangeSelectionUtils.isSelected(
                itemValue,
                startValue,
                endValue,
                this._options.selectionProcessing,
                this._options.selectionBaseValue,
                this._options.selectionHoveredValue
            )
        ) {
            dataQA = 'controls-PeriodDialog-MonthsRange__item-selected';
        } else {
            dataQA = 'controls-PeriodDialog-MonthsRange__item';
        }
        return dataQA;
    }

    private _isHalfYearEnabled(date: Date): boolean {
        if (!this._halfyearSelectionEnabled) {
            return false;
        }

        if (!this._options.isDayAvailable) {
            return true;
        }

        return isRangeEnabled(date, dateUtils.isHalfYearsEqual, this._options.isDayAvailable);
    }

    private _isQuarterEnabled(date: Date): boolean {
        if (!this._quarterSelectionEnabled) {
            return false;
        }

        if (!this._options.isDayAvailable) {
            return true;
        }

        return isRangeEnabled(date, dateUtils.isQuartersEqual, this._options.isDayAvailable);
    }

    private _isMonthEnabled(date: Date): boolean {
        if (!this._options.isDayAvailable) {
            return true;
        }

        return isRangeEnabled(date, dateUtils.isMonthsEqual, this._options.isDayAvailable);
    }

    private _calculateRangeSelectedCallback(startValue: Date, endValue: Date): Date[] {
        let startDate = startValue;
        let endDate = endValue;
        if (this._options.rangeSelectedCallback) {
            const ranges = this._options.rangeSelectedCallback(startValue, endValue);
            startDate = ranges[0];
            endDate = ranges[1];
        }
        return [startDate, endDate];
    }

    static SELECTION_VIEW_TYPES: object = SELECTION_VIEW_TYPES;
}
