import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {date as formatDate} from 'Types/formatter';
import {Base as dateUtils} from 'Controls/dateUtils';
import itemMonthsTmpl = require('wml!Controls/_shortDatePicker/ItemMonths');
import MonthCaption = require('wml!Controls/_shortDatePicker/MonthCaption');
import itemFullTmpl = require('wml!Controls/_shortDatePicker/ItemFull');
import itemQuartersTmpl = require('wml!Controls/_shortDatePicker/ItemQuarters');
import {Date as WSDate} from 'Types/entity';
import {IDateConstructor, IDateConstructorOptions} from 'Controls/interface';
import {SyntheticEvent} from 'Vdom/Vdom';
import {constants} from 'Env/Env';

interface IShortDatePickerOptions extends IControlOptions, IDateConstructorOptions {
    currentYear?: number;
}

const MONTHS_IN_HALFYEAR = 6;
const MONTHS_IN_QUARTER = 3;

/**
 * Контрол, отвечающий за отображение центральной части в окне Быстрого выбора периода.
 * Отображение определяется значениями опций chooseHalfyears, chooseQuarters, chooseMonths, chooseYears.
 * @private
 * @author Красильников А.С.
 */

class BodyItem extends Control<IShortDatePickerOptions> implements IDateConstructor {
    readonly '[Controls/_interface/IDateConstructor]': boolean = true;
    protected _template: TemplateFunction = itemMonthsTmpl;
    protected monthCaptionTemplate: TemplateFunction = MonthCaption;

    protected _yearModel: object[];

    protected _halfYearHovered: number = null;
    protected _quarterHovered: number = null;

    protected _formatDate: Function = formatDate;

    protected _isMonthsTemplateString: boolean;

    protected _beforeMount(options: IShortDatePickerOptions): void {
        this._template = this._getItemTmplByType(options);
        this._yearModel = this._getYearModel(options.currentYear, options.dateConstructor);
        this._isMonthsTemplateString = typeof options.monthTemplate === 'string';
    }

    protected _beforeUpdate(newOptions: IShortDatePickerOptions): void {
        this._yearModel = this._getYearModel(newOptions.currentYear, newOptions.dateConstructor);
        this._isMonthsTemplateString = typeof newOptions.monthTemplate === 'string';
    }

    protected _getItemTmplByType(options: IShortDatePickerOptions): TemplateFunction {
        if (options.chooseQuarters && options.chooseMonths) {
            return itemFullTmpl;
        } else if (options.chooseMonths) {
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
                        date: new dateConstructor(year, month, 1),
                        tooltip: formatDate(new Date(year, month, 1), formatDate.FULL_MONTH)
                    });
                }
                quartersList.push({
                    name: numerals[quarter],
                    number: quarter,
                    fullName: formatDate(new Date(year, quarterMonth, 1), 'QQQQr'),
                    tooltip: formatDate(new Date(year, quarterMonth, 1), formatDate.FULL_QUARTER),
                    months: monthsList
                });
            }
            halfYearsList.push({
                name: numerals[halfYear],
                number: halfYear,
                tooltip: formatDate(new Date(year, halfYear * MONTHS_IN_HALFYEAR, 1), formatDate.FULL_HALF_YEAR),
                quarters: quartersList
            });
        }
        return halfYearsList;
    }

    protected _onQuarterMouseEnter(event: Event, quarter: number): void {
        this._halfYearHovered = null;
        this._quarterHovered = quarter;
    }

    protected _onQuarterMouseLeave(): void {
        this._quarterHovered = null;
    }

    protected _onHalfYearMouseEnter(event: Event, halfYear: number): void {
        this._quarterHovered = null;
        this._halfYearHovered = halfYear;
    }

    protected _onHalfYearMouseLeave(): void {
        this._halfYearHovered = null;
    }

    protected _onHeaderClick(): void {
        this._notify('close', [], {bubbling: true});
    }

    protected _onYearClick(event: Event, year: number): void {
        const lastMonth: number = 11;
        const lastDay: number = 31;
        if (this._options.chooseYears) {
            const start = new this._options.dateConstructor(year, 0, 1);
            const end = new WSDate(year, lastMonth, lastDay );
            this._notifySendResult(start, end);
        }
    }

    protected _onHalfYearClick(event: Event, halfYear: number, year: number): void {
        const start = new this._options.dateConstructor(year, halfYear * MONTHS_IN_HALFYEAR, 1);
        const end = new this._options.dateConstructor(year, (halfYear + 1) * MONTHS_IN_HALFYEAR, 0);
        this._notifySendResult(start, end);
    }

    protected _onQuarterClick(event: Event, quarter: number, year: number): void {
        const start = new this._options.dateConstructor(year, quarter * MONTHS_IN_QUARTER, 1);
        const end = new this._options.dateConstructor(year, (quarter + 1) * MONTHS_IN_QUARTER, 0);
        this._notifySendResult(start, end);
    }

    protected _onMonthClick(event: Event, month: Date): void {
        this._notifySendResult(month, dateUtils.getEndOfMonth(month));
    }

    private _notifySendResult(start: Date, end: Date): void {
        this._notify('sendResult', [start, end], {bubbling: true});
    }

    protected _getTabindex(): number {
        let tabindex = -1;
        if (this._options.date.getFullYear() === this._options._position.getFullYear() || this._options._tabPressed) {
            tabindex = 0;
        }
        return tabindex;
    }

    protected _keyupHandler(event: SyntheticEvent): void {
        if (event.nativeEvent.keyCode === constants.key.tab) {
            const key = event.target.getAttribute('name');
            this._hoverPeriod(key);
        } else if (event.nativeEvent.keyCode === constants.key.enter) {
            this._selectPeriodByPressEnter();
        }
    }

    protected _keyupMonthHandler(event: SyntheticEvent, month: Date): void {
        if (event.nativeEvent.keyCode === constants.key.enter) {
            this._onMonthClick(event, month);
        }
    }

    protected _keyupQuarterHandler(event: SyntheticEvent, quarter: number, year: number): void {
        if (event.nativeEvent.keyCode === constants.key.enter) {
            this._onQuarterClick(event, quarter, year);
        }
    }

    private _selectPeriodByPressEnter(): void {
        if (this._halfYearHovered === null && this._quarterHovered === null) {
            return;
        }

        let start;
        let end;
        if (this._halfYearHovered !== null) {
            start = new this._options.dateConstructor(this._options.currentYear,
                this._halfYearHovered * MONTHS_IN_HALFYEAR, 1);
            end = new this._options.dateConstructor(this._options.currentYear,
                (this._halfYearHovered + 1) * MONTHS_IN_HALFYEAR, 0);
        }
        if (this._quarterHovered !== null) {
            start = new this._options.dateConstructor(this._options.currentYear,
                this._quarterHovered * MONTHS_IN_QUARTER, 1);
            end = new this._options.dateConstructor(this._options.currentYear,
                (this._quarterHovered + 1) * MONTHS_IN_QUARTER, 0);
        }
        this._notifySendResult(start, end);
    }

    private _hoverPeriod(key: string): void {
        if (key) {
            const period = parseInt(key[2], 10);
            if (key[0] === 'q') {
                this._quarterHovered = period;
            } else {
                this._halfYearHovered = period;
            }
        }
    }

    protected _onHalfYearBlur(): void {
        this._halfYearHovered = null;
    }

    protected _onQuarterBlur(): void {
        this._quarterHovered = null;
    }

    static getDefaultOptions(): IShortDatePickerOptions {
        return {
            dateConstructor: WSDate
        };
    }
}

Object.defineProperty(BodyItem, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return BodyItem.getDefaultOptions();
   }
});

export default BodyItem;
