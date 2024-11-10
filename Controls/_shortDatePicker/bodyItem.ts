/**
 * @kaizen_zone d7dff399-200f-4169-9c69-4c54617de7e8
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { date as formatDate } from 'Types/formatter';
import { Base as dateUtils } from 'Controls/dateUtils';
import itemMonthsTmpl = require('wml!Controls/_shortDatePicker/ItemMonths');
import MonthCaption = require('wml!Controls/_shortDatePicker/MonthCaption');
import itemFullTmpl = require('wml!Controls/_shortDatePicker/ItemFull');
import itemQuartersTmpl = require('wml!Controls/_shortDatePicker/ItemQuarters');
import { Date as WSDate } from 'Types/entity';
import { IDateConstructor, IDateConstructorOptions } from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import { IDateLitePopupOptions } from 'Controls/_shortDatePicker/IDateLitePopup';
import {
    MONTHS_IN_HALFYEAR,
    MONTHS_IN_QUARTER,
    BORDER_RADIUS_CLASSES,
    BORDER_CLASSES,
} from './resources/constants';

interface IShortDatePickerOptions
    extends IControlOptions,
        IDateConstructorOptions,
        IDateLitePopupOptions {
    currentYear?: number;
}

/**
 * Контрол, отвечающий за отображение центральной части в окне Быстрого выбора периода.
 * Отображение определяется значениями опций chooseHalfyears, chooseQuarters, chooseMonths, chooseYears.
 * @private
 */

class BodyItem extends Control<IShortDatePickerOptions> implements IDateConstructor {
    readonly '[Controls/_interface/IDateConstructor]': boolean = true;
    protected _template: TemplateFunction = itemMonthsTmpl;
    protected monthCaptionTemplate: TemplateFunction = MonthCaption;

    protected _yearModel: object[];
    protected _yearItems: object[];

    protected _halfYearHovered: number = null;
    protected _quarterHovered: number = null;
    protected _monthHovered: number = null;

    private _mouseDownHandled: boolean = false;
    // При клике на элемент, сначала выстрелит событие mouseMove, а только потом click.
    // Это приводит к тому, что элемент выбирается моментально при первом клике (Т.к. стреляет сразу два itemClick).
    // Состояние нужно, для того чтобы проигнорировать первый mouseMove.
    private _mouseMoveHandled: boolean = false;

    protected _formatDate: Function = formatDate;

    protected _isMonthsTemplateString: boolean;

    private _mouseEnterHandled: boolean = false;

    protected _beforeMount(options: IShortDatePickerOptions): void {
        this._template = this._getItemTmplByType(options);
        this._isMonthsTemplateString = typeof options.monthTemplate === 'string';
        this._updateItem(options);
    }

    protected _beforeUpdate(newOptions: IShortDatePickerOptions): void {
        if (this._options.yearItemsCallback !== newOptions.yearItemsCallback) {
            this._updateItem(newOptions);
        }
        this._isMonthsTemplateString = typeof newOptions.monthTemplate === 'string';
    }

    protected _updateItem(options: IShortDatePickerOptions): void {
        if (options.yearItemsCallback) {
            this._yearItems = this._getYearItems(options);
        } else {
            this._yearModel = this._getYearModel(options.currentYear, options.dateConstructor);
        }
    }

    protected _getYearItems(options: IShortDatePickerOptions): object[] {
        const monthItems = [];
        options.yearItemsCallback(options.date).forEach((yearItem, index) => {
            monthItems.push({
                date: yearItem.startValue,
                number: index,
                tooltip: yearItem.tooltip,
                selected:
                    dateUtils.isDatesEqual(yearItem.startValue, options.startValue) &&
                    dateUtils.isDatesEqual(yearItem.endValue, options.endValue),
                endValue: yearItem.endValue,
            });
        });
        return monthItems;
    }

    protected _getItemTmplByType(options: IShortDatePickerOptions): TemplateFunction {
        if (options.chooseQuarters && options.chooseMonths && !options.yearItemsCallback) {
            return itemFullTmpl;
        } else if (options.chooseMonths || options.yearItemsCallback) {
            return itemMonthsTmpl;
        } else if (options.chooseQuarters) {
            return itemQuartersTmpl;
        }
    }

    protected _getYearModel(year: number, dateConstructor: IDateConstructor): object[] {
        const numerals = ['I', 'II', 'III', 'IV'];
        const halfYearsList = [];

        for (let halfYear = 0; halfYear < 2; halfYear++) {
            const quartersList = [];
            for (let i = 0; i < 2; i++) {
                const monthsList = [];
                const quarter = halfYear * 2 + i;
                const quarterMonth = quarter * MONTHS_IN_QUARTER;
                for (let j = 0; j < MONTHS_IN_QUARTER; j++) {
                    const month = quarterMonth + j;
                    monthsList.push({
                        number: month,
                        date: new dateConstructor(year, month, 1),
                        tooltip: formatDate(new Date(year, month, 1), formatDate.FULL_MONTH),
                    });
                }
                quartersList.push({
                    date: new dateConstructor(year, quarterMonth),
                    name: numerals[quarter],
                    number: quarter,
                    fullName: formatDate(new Date(year, quarterMonth, 1), 'QQQQr'),
                    tooltip: formatDate(new Date(year, quarterMonth, 1), formatDate.FULL_QUARTER),
                    months: monthsList,
                });
            }
            const halfYearMonth = halfYear * MONTHS_IN_HALFYEAR;
            halfYearsList.push({
                date: new dateConstructor(year, halfYearMonth),
                name: numerals[halfYear],
                number: halfYear,
                tooltip: formatDate(
                    new Date(year, halfYear * MONTHS_IN_HALFYEAR, 1),
                    formatDate.FULL_HALF_YEAR
                ),
                quarters: quartersList,
            });
        }
        return halfYearsList;
    }

    protected _onQuarterMouseOver(event: Event, quarter: number, value: Date): void {
        if (!this._mouseEnterHandled) {
            this._onQuarterMouseEnter(event, quarter, value);
        }
    }

    protected _onQuarterMouseEnter(event: Event, quarter: number, value: Date): void {
        this._mouseEnterHandled = true;
        this._halfYearHovered = null;
        this._monthHovered = null;
        this._quarterHovered = quarter;
        this._notifyHoveredItemChanged('quarter');
        this._notify('itemMouseEnter', [value]);
    }

    protected _onQuarterMouseLeave(): void {
        this._quarterHovered = null;
    }

    protected _onMonthMouseOver(event: Event, mount: number, value: Date): void {
        if (!this._mouseEnterHandled) {
            this._onMonthMouseEnter(event, mount, value);
        }
    }

    protected _onMouseMove(event: Event, value: Date) {
        if (this._mouseDownHandled) {
            if (!this._mouseMoveHandled) {
                this._mouseMoveHandled = true;
            } else {
                this._mouseDownHandled = false;
                this._notify('itemClick', [value, event]);
            }
        }
    }

    protected _onMonthMouseEnter(event: Event, mount: number, value): void {
        this._halfYearHovered = null;
        this._quarterHovered = null;
        this._monthHovered = mount;
        this._notifyHoveredItemChanged('month');
        this._notify('itemMouseEnter', [value]);
    }

    protected _onHalfYearMouseEnter(event: Event, halfYear: number, value: Date): void {
        this._quarterHovered = null;
        this._monthHovered = null;
        this._halfYearHovered = halfYear;
        this._notifyHoveredItemChanged('halfyear');
        this._notify('itemMouseEnter', [value]);
    }

    protected _onHalfYearMouseLeave(): void {
        this._halfYearHovered = null;
    }

    protected _onYearClick(event: Event, year: number): void {
        const lastMonth: number = 11;
        const lastDay: number = 31;
        if (this._options.chooseYears) {
            const start = new this._options.dateConstructor(year, 0, 1);
            const end = new this._options.dateConstructor(year, lastMonth, lastDay);
            this._notifySendResult(start, end);
        }
    }

    protected _onHalfYearClick(event: Event, halfYear: number, year: number): void {
        this._selectHalfYear(halfYear, year);
    }

    protected _onQuarterClick(event: Event, quarter: number, year: number): void {
        this._selectQuarter(quarter, year);
    }

    protected _onMonthClick(
        event: Event,
        startValue: Date,
        endValue: Date = dateUtils.getEndOfMonth(startValue)
    ): void {
        this._notifySendResult(startValue, endValue);
    }

    private _notifyHoveredItemChanged(value: string): void {
        this._notify('hoveredItemChanged', [value], { bubbling: true });
    }

    private _getMainPeriodType(basePeriodType: string): string {
        if (this._options.startValue === null && this._options.endValue === null) {
            return;
        }
        if (!this._options.chooseMonths || !this._options.chooseQuarters) {
            return basePeriodType;
        }
        if (
            dateUtils.isStartOfHalfyear(this._options.startValue) &&
            dateUtils.isEndOfHalfyear(this._options.endValue) &&
            (!this._options.selectionProcessing || this._options.hoveredItem === 'halfyear')
        ) {
            return 'halfyear';
        }
        if (
            dateUtils.isStartOfQuarter(this._options.startValue) &&
            dateUtils.isEndOfQuarter(this._options.endValue) &&
            (!this._options.selectionProcessing || this._options.hoveredItem === 'quarter')
        ) {
            return 'quarter';
        }
        if (
            dateUtils.isStartOfMonth(this._options.startValue) &&
            dateUtils.isEndOfMonth(this._options.endValue)
        ) {
            return 'month';
        }
    }

    private _getEndValue(value: Date, periodType: string): Date {
        if (periodType === 'month') {
            return dateUtils.getEndOfMonth(value);
        }
        if (periodType === 'quarter') {
            return dateUtils.getEndOfQuarter(value);
        }
        if (periodType === 'halfyear') {
            return dateUtils.getEndOfHalfyear(value);
        }
        if (periodType === 'year') {
            return dateUtils.getEndOfYear(value);
        }
    }

    protected _startCornerVisible(value: Date, periodType: string): boolean {
        if (
            this._options.selectionProcessing &&
            this._options.startValue < this._options.selectionBaseValue
        ) {
            return false;
        }
        if (
            dateUtils.isMonthsEqual(this._options.startValue, this._options.endValue) &&
            !this._options.selectionProcessing
        ) {
            return false;
        }
        return this._isSelectedStart(value, periodType);
    }

    protected _endCornerVisible(value: Date, periodType: string): boolean {
        if (
            (this._options.selectionProcessing &&
                this._options.startValue >= this._options.selectionBaseValue) ||
            dateUtils.isMonthsEqual(this._options.startValue, this._options.endValue)
        ) {
            return false;
        }
        return this._isSelectedEnd(value, periodType);
    }

    protected _isSelectedStart(value: Date, periodType: string): boolean {
        const mainPeriodType = this._getMainPeriodType(periodType);
        const startValue = new Date(
            this._options?.startValue?.getFullYear(),
            this._options?.startValue?.getMonth(),
            this._options?.startValue?.getDate()
        );
        return dateUtils.isDatesEqual(startValue, value) && mainPeriodType === periodType;
    }

    protected _isSelectedEnd(value: Date, periodType: string): boolean {
        const mainPeriodType = this._getMainPeriodType(periodType);
        const endOfPeriod = this._getEndValue(value, periodType);
        const endValue = new Date(
            this._options?.endValue?.getFullYear(),
            this._options?.endValue?.getMonth(),
            this._options?.endValue?.getDate()
        );
        return dateUtils.isDatesEqual(endValue, endOfPeriod) && mainPeriodType === periodType;
    }

    protected _onMonthCornerClick(event: Event, startValue: Date, selectionType?: string): void {
        let value = startValue;
        if (this._options.selectionProcessing) {
            value = dateUtils.getEndOfMonth(value);
        }
        if (selectionType) {
            this._notify('selectionTypeChanged', [selectionType], { bubbling: true });
        }
        this._mouseDownHandled = false;
        event.stopImmediatePropagation();
        this._notify('itemClick', [value]);
    }

    protected _onMouseDown() {
        if (!this._options.selectionProcessing && this._options.multiSelect) {
            this._mouseDownHandled = true;
        }
    }

    protected _onMonthMouseUp(event: Event, value: Date) {
        if (this._options.selectionProcessing) {
            const endValue = dateUtils.getEndOfMonth(value);
            this._notifySendResult(value, endValue);
        }
    }

    protected _onQuarterMouseUp(event: Event, value: Date) {
        if (this._options.selectionProcessing) {
            const endValue = dateUtils.getEndOfQuarter(value);
            this._notifySendResult(value, endValue);
        }
    }

    protected _onHalfyearMouseUp(event: Event, value: Date) {
        if (this._options.selectionProcessing) {
            const endValue = dateUtils.getEndOfHalfyear(value);
            this._notifySendResult(value, endValue);
        }
    }

    protected _isSelectedPeriod(value: Date, periodType: string): boolean {
        const mainPeriodType = this._getMainPeriodType(periodType);

        const isSelected = () => {
            const range = [this._options.startValue, this._options.endValue];
            return (
                dateUtils.hitsDisplayedRanges(periodStartValue, [range]) &&
                dateUtils.hitsDisplayedRanges(periodEndValue, [range]) &&
                (this._options.startValue || this._options.endValue)
            );
        };

        const periodStartValue = value;
        const periodEndValue = this._getEndValue(value, periodType);

        return periodType === mainPeriodType && isSelected();
    }

    protected _getSelectionClassName(value: Date, periodType: string): string {
        if (this._options.hovered && !this._options.selectionProcessing) {
            return '';
        }
        let className = '';
        const startValue = this._options?.startValue
            ? new Date(
                  this._options?.startValue?.getFullYear(),
                  this._options?.startValue?.getMonth(),
                  this._options?.startValue?.getDate()
              )
            : this._options?.startValue;
        const endValue = this._options?.endValue
            ? new Date(
                  this._options?.endValue?.getFullYear(),
                  this._options?.endValue?.getMonth(),
                  this._options?.endValue?.getDate()
              )
            : this._options?.endValue;
        const periodStartValue = value;
        const periodEndValue = this._getEndValue(value, periodType);
        const isSelected = () => {
            const range = [startValue, endValue];
            return (
                dateUtils.hitsDisplayedRanges(periodStartValue, [range]) &&
                dateUtils.hitsDisplayedRanges(periodEndValue, [range])
            );
        };
        const isPeriodSelected = isSelected();
        const mainPeriodType = this._getMainPeriodType(periodType);
        if (dateUtils.isDatesEqual(startValue, periodStartValue)) {
            if (periodType === mainPeriodType) {
                className += BORDER_RADIUS_CLASSES.topRight;
                className += BORDER_RADIUS_CLASSES.topLeft;
                className += BORDER_CLASSES.top;
            }
        }
        if (dateUtils.isDatesEqual(endValue, periodEndValue)) {
            if (periodType === mainPeriodType) {
                className += BORDER_RADIUS_CLASSES.bottomRight;
                className += BORDER_RADIUS_CLASSES.bottomLeft;
                className += BORDER_CLASSES.bottom;
            }
        }
        if (isPeriodSelected && periodType === mainPeriodType) {
            className += BORDER_CLASSES.left;
            className += BORDER_CLASSES.right;
        }
        if (mainPeriodType === periodType && isPeriodSelected) {
            let firstPeriod;
            let lasPeriod;
            if (mainPeriodType === 'halfyear') {
                firstPeriod = this._yearModel[0].date;
                lasPeriod = this._yearModel[1].date;
            }
            if (mainPeriodType === 'quarter') {
                firstPeriod = this._yearModel[0].quarters[0].date;
                lasPeriod = this._yearModel[1].quarters[1].date;
            }
            if (mainPeriodType === 'month') {
                firstPeriod = this._yearModel[0].quarters[0].months[0].date;
                lasPeriod = this._yearModel[1].quarters[1].months[2].date;
            }
            if (lasPeriod && firstPeriod) {
                if (dateUtils.isDatesEqual(periodStartValue, firstPeriod)) {
                    className += BORDER_CLASSES.top;
                    className += BORDER_RADIUS_CLASSES.topRight;
                    className += BORDER_RADIUS_CLASSES.topLeft;
                }
                if (dateUtils.isDatesEqual(periodStartValue, lasPeriod)) {
                    className += BORDER_CLASSES.bottom;
                    className += BORDER_RADIUS_CLASSES.bottomRight;
                    className += BORDER_RADIUS_CLASSES.bottomLeft;
                }
            }
        }

        return className;
    }

    private _selectHalfYear(halfYear: number, year: number): void {
        const start = new this._options.dateConstructor(year, halfYear * MONTHS_IN_HALFYEAR, 1);
        const end = new this._options.dateConstructor(year, (halfYear + 1) * MONTHS_IN_HALFYEAR, 0);
        this._notifySendResult(start, end);
    }

    private _selectQuarter(quarter: number, year: number): void {
        const start = new this._options.dateConstructor(year, quarter * MONTHS_IN_QUARTER, 1);
        const end = new this._options.dateConstructor(year, (quarter + 1) * MONTHS_IN_QUARTER, 0);
        this._notifySendResult(start, end);
    }

    private _notifySendResult(start: Date, end: Date): void {
        if (this._options.selectionProcessing) {
            this._notify('itemClick', [end]);
            return;
        }
        this._notify('sendResult', [start, end], { bubbling: true });
    }

    protected _hitsDisplayedRanges(date: Date): boolean {
        return dateUtils.hitsDisplayedRanges(date, this._options.displayedRanges);
    }

    protected _getTabindex(): number {
        let tabindex = -1;
        if (
            this._options.date.getFullYear() === this._options._position.getFullYear() ||
            this._options._tabPressed
        ) {
            tabindex = 0;
        }
        return tabindex;
    }

    protected _keyUpHandler(event: SyntheticEvent): void {
        if (event.nativeEvent.keyCode === constants.key.tab) {
            let key = event.target.getAttribute('name');
            if (!key) {
                key = event.target
                    .closest('.controls-PeriodLiteDialog-item__caption')
                    ?.getAttribute('name');
            }
            this._hoverPeriod(key);
        } else if (event.nativeEvent.keyCode === constants.key.enter) {
            this._selectPeriodByPressEnter();
        }
    }

    protected _keyUpMonthHandler(event: SyntheticEvent, month: Date): void {
        if (event.nativeEvent.keyCode === constants.key.enter) {
            this._onMonthClick(event, month);
        }
    }

    protected _keyUpQuarterHandler(event: SyntheticEvent, quarter: number, year: number): void {
        if (event.nativeEvent.keyCode === constants.key.enter) {
            this._onQuarterClick(event, quarter, year);
        }
    }

    private _selectPeriodByPressEnter(): void {
        if (this._halfYearHovered !== null) {
            this._selectHalfYear(this._halfYearHovered, this._options.currentYear);
        }
        if (this._quarterHovered !== null) {
            this._selectQuarter(this._quarterHovered, this._options.currentYear);
        }
    }

    private _hoverPeriod(key: string): void {
        if (key) {
            const value = key.split('-')[1];
            const period = Number(value);
            this._monthHovered = null;
            if (key.indexOf('quarter') !== -1) {
                this._quarterHovered = period;
            } else if (key.indexOf('halfYear') !== -1) {
                this._halfYearHovered = period;
            } else if (key.indexOf('month') !== -1) {
                this._monthHovered = period;
            }
        }
    }

    protected _onHalfYearBlur(): void {
        this._halfYearHovered = null;
    }

    protected _onQuarterBlur(): void {
        this._quarterHovered = null;
    }

    protected _onMonthBlur(): void {
        this._monthHovered = null;
    }

    static getDefaultOptions(): IShortDatePickerOptions {
        return {
            dateConstructor: WSDate,
        };
    }
}

export default BodyItem;
