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

interface IShortDatePickerOptions
    extends IControlOptions,
        IDateConstructorOptions,
        IDateLitePopupOptions {
    currentYear?: number;
}

const MONTHS_IN_HALFYEAR = 6;
const MONTHS_IN_QUARTER = 3;

/**
 * Контрол, отвечающий за отображение центральной части в окне Быстрого выбора периода.
 * Отображение определяется значениями опций chooseHalfyears, chooseQuarters, chooseMonths, chooseYears.
 * @private
 */

class BodyItem
    extends Control<IShortDatePickerOptions>
    implements IDateConstructor
{
    readonly '[Controls/_interface/IDateConstructor]': boolean = true;
    protected _template: TemplateFunction = itemMonthsTmpl;
    protected monthCaptionTemplate: TemplateFunction = MonthCaption;

    protected _yearModel: object[];
    protected _yearItems: object[];

    protected _halfYearHovered: number = null;
    protected _quarterHovered: number = null;
    protected _monthHovered: number = null;

    protected _formatDate: Function = formatDate;

    protected _isMonthsTemplateString: boolean;

    private _mouseEnterHandled: boolean = false;

    protected _beforeMount(options: IShortDatePickerOptions): void {
        this._template = this._getItemTmplByType(options);
        this._isMonthsTemplateString =
            typeof options.monthTemplate === 'string';
        this._updateItem(options);
    }

    protected _beforeUpdate(newOptions: IShortDatePickerOptions): void {
        this._updateItem(newOptions);
        this._isMonthsTemplateString =
            typeof newOptions.monthTemplate === 'string';
    }

    protected _updateItem(options: IShortDatePickerOptions): void {
        if (options.yearItemsCallback) {
            this._yearItems = this._getYearItems(options);
        } else {
            this._yearModel = this._getYearModel(
                options.currentYear,
                options.dateConstructor
            );
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
                    dateUtils.isDatesEqual(
                        yearItem.startValue,
                        options.startValue
                    ) &&
                    dateUtils.isDatesEqual(yearItem.endValue, options.endValue),
                endValue: yearItem.endValue,
            });
        });
        return monthItems;
    }

    protected _getItemTmplByType(
        options: IShortDatePickerOptions
    ): TemplateFunction {
        if (
            options.chooseQuarters &&
            options.chooseMonths &&
            !options.yearItemsCallback
        ) {
            return itemFullTmpl;
        } else if (options.chooseMonths || options.yearItemsCallback) {
            return itemMonthsTmpl;
        } else if (options.chooseQuarters) {
            return itemQuartersTmpl;
        }
    }

    protected _getYearModel(
        year: number,
        dateConstructor: IDateConstructor
    ): object[] {
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
                        tooltip: formatDate(
                            new Date(year, month, 1),
                            formatDate.FULL_MONTH
                        ),
                    });
                }
                quartersList.push({
                    date: new dateConstructor(year, quarterMonth),
                    name: numerals[quarter],
                    number: quarter,
                    fullName: formatDate(
                        new Date(year, quarterMonth, 1),
                        'QQQQr'
                    ),
                    tooltip: formatDate(
                        new Date(year, quarterMonth, 1),
                        formatDate.FULL_QUARTER
                    ),
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

    protected _onQuarterMouseOver(event: Event, quarter: number): void {
        if (!this._mouseEnterHandled) {
            this._onQuarterMouseEnter(event, quarter);
        }
    }

    protected _onQuarterMouseEnter(event: Event, quarter: number): void {
        this._mouseEnterHandled = true;
        this._halfYearHovered = null;
        this._monthHovered = null;
        this._quarterHovered = quarter;
    }

    protected _onQuarterMouseLeave(): void {
        this._quarterHovered = null;
    }

    protected _onMonthMouseOver(event: Event, mount: number): void {
        if (!this._mouseEnterHandled) {
            this._onMonthMouseEnter(event, mount);
        }
    }

    protected _onMonthMouseEnter(event: Event, mount: number): void {
        this._halfYearHovered = null;
        this._quarterHovered = null;
        this._monthHovered = mount;
    }

    protected _onHalfYearMouseEnter(event: Event, halfYear: number): void {
        this._quarterHovered = null;
        this._monthHovered = null;
        this._halfYearHovered = halfYear;
    }

    protected _onHalfYearMouseLeave(): void {
        this._halfYearHovered = null;
    }

    protected _onYearClick(event: Event, year: number): void {
        const lastMonth: number = 11;
        const lastDay: number = 31;
        if (this._options.chooseYears) {
            const start = new this._options.dateConstructor(year, 0, 1);
            const end = new this._options.dateConstructor(
                year,
                lastMonth,
                lastDay
            );
            this._notifySendResult(start, end);
        }
    }

    protected _onHalfYearClick(
        event: Event,
        halfYear: number,
        year: number
    ): void {
        this._selectHalfYear(halfYear, year);
    }

    protected _onQuarterClick(
        event: Event,
        quarter: number,
        year: number
    ): void {
        this._selectQuarter(quarter, year);
    }

    protected _onMonthClick(
        event: Event,
        startValue: Date,
        endValue: Date = dateUtils.getEndOfMonth(startValue)
    ): void {
        this._notifySendResult(startValue, endValue);
    }

    private _selectHalfYear(halfYear: number, year: number): void {
        const start = new this._options.dateConstructor(
            year,
            halfYear * MONTHS_IN_HALFYEAR,
            1
        );
        const end = new this._options.dateConstructor(
            year,
            (halfYear + 1) * MONTHS_IN_HALFYEAR,
            0
        );
        this._notifySendResult(start, end);
    }

    private _selectQuarter(quarter: number, year: number): void {
        const start = new this._options.dateConstructor(
            year,
            quarter * MONTHS_IN_QUARTER,
            1
        );
        const end = new this._options.dateConstructor(
            year,
            (quarter + 1) * MONTHS_IN_QUARTER,
            0
        );
        this._notifySendResult(start, end);
    }

    private _notifySendResult(start: Date, end: Date): void {
        this._notify('sendResult', [start, end], { bubbling: true });
    }

    protected _getTabindex(): number {
        let tabindex = -1;
        if (
            this._options.date.getFullYear() ===
                this._options._position.getFullYear() ||
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

    protected _keyUpQuarterHandler(
        event: SyntheticEvent,
        quarter: number,
        year: number
    ): void {
        if (event.nativeEvent.keyCode === constants.key.enter) {
            this._onQuarterClick(event, quarter, year);
        }
    }

    private _selectPeriodByPressEnter(): void {
        if (this._halfYearHovered !== null) {
            this._selectHalfYear(
                this._halfYearHovered,
                this._options.currentYear
            );
        }
        if (this._quarterHovered !== null) {
            this._selectQuarter(
                this._quarterHovered,
                this._options.currentYear
            );
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
