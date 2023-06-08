/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopup/MonthsRangeItem';
import { Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { MonthModel as modelViewModel, MonthViewDayTemplate } from 'Controls/calendar';
import {
    IDateRangeSelectable,
    IRangeSelectableOptions,
    IDateRangeSelectableOptions,
    IDateRangeOptions,
} from 'Controls/dateRange';
import rangeSelectionUtils from 'Controls/_datePopup/RangeSelection';
import { Base as dateUtils } from 'Controls/dateUtils';
import { isRangeEnabled } from 'Controls/_datePopup/Utils/RangeEnabled';
import * as coreMerge from 'Core/core-merge';
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import getDayTemplate from './getDayTemplate';

interface IMonthsRangeItemOptions
    extends IControlOptions,
        IRangeSelectableOptions,
        IDateRangeSelectableOptions,
        IDateRangeOptions {
    position: Date;
    isDayAvailable: Function;
}

/**
 * Item for the period selection component of multiple months.
 *
 * @class Controls/_datePopup/MonthsRangeItem
 * @extends UI/Base:Control
 *
 * @private
 */

const SELECTION_VIEW_TYPES = {
    days: 'days',
    months: 'months',
};

const MONTHS_RANGE_CSS_CLASS_PREFIX: string =
    'controls-PeriodDialog-MonthsRange__';

export default class MonthsRangeItem extends Control<IMonthsRangeItemOptions> {

    protected _dayTemplate: TemplateFunction;
    protected _template: TemplateFunction = template;
    protected _monthViewModel: modelViewModel = modelViewModel;
    protected _SELECTION_VIEW_TYPES: string = SELECTION_VIEW_TYPES;
    protected _FULL_HALF_YEAR: string = formatDate.FULL_HALF_YEAR;
    protected _FULL_QUARTER: string = formatDate.FULL_QUARTER;
    protected _quarterHovered: boolean;
    protected _halfYearHovered: boolean;
    protected _selectionViewType: string;
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

    protected _beforeMount(options: IMonthsRangeItemOptions): void {
        this._dayTemplate = getDayTemplate(
            MonthViewDayTemplate
        );
        const year = options.date.getFullYear();
        this._selectionViewType = options.selectionViewType;
        if (
            options.readOnly ||
            options.selectionType ===
                IDateRangeSelectable.SELECTION_TYPES.single ||
            options.selectionType ===
                IDateRangeSelectable.SELECTION_TYPES.disable
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

    protected _beforeUpdate(options: IMonthsRangeItemOptions): void {
        if (this._options.selectionViewType !== options.selectionViewType) {
            this._selectionViewType = options.selectionViewType;
        }
    }

    protected _proxyEvent(event: IMonthsRangeItemOptions): void {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    }

    protected _onQuarterClick(event: Date, date: Date): void {
        if (this._isQuarterEnabled(date)) {
            this._selectionViewType = SELECTION_VIEW_TYPES.months;
            this._notify('selectionViewTypeChanged', [this._selectionViewType]);
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

    protected _onHalfYearClick(event: Event, date: Date): void {
        if (this._isHalfYearEnabled(date)) {
            this._selectionViewType = SELECTION_VIEW_TYPES.months;
            this._notify('selectionViewTypeChanged', [this._selectionViewType]);
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

    protected _onMonthTitleClick(event: Event, date: Date): void {
        if (
            this._monthsSelectionEnabled &&
            this._isMonthEnabled(date) &&
            !this._options.selectionProcessing &&
            this._options.monthClickable
        ) {
            this._selectionViewType = SELECTION_VIEW_TYPES.months;
            this._notify('selectionViewTypeChanged', [this._selectionViewType]);

            this._notify('itemClick', [date]);
        }
    }

    protected _onMonthTitleMouseEnter(event: Event, date: Date): void {
        if (!this._options.selectionProcessing) {
            this._notify('itemMouseEnter', [date]);
        }
    }

    protected _onMonthTitleMouseLeave(event: Event, date: Date): void {
        if (
            !this._options.selectionProcessing &&
            this._options.monthClickable
        ) {
            this._notify('itemMouseLeave', [date]);
        }
    }

    protected _onMonthBodyClick(event: Event, date: Date): void {
        if (
            !this._options.selectionProcessing &&
            this._options.monthClickable
        ) {
            this._notify('monthClick', [date]);
        }
    }

    protected _onMonthClick(event: Event, date: Date): void {
        this._chooseMonth(date);
    }

    protected _onMonthMouseOver(event: Event, date: Date): void {
        if (!this._mouseEnterHandled) {
            this._onMonthMouseEnter(event, date);
        }
    }

    protected _onMonthMouseEnter(event: Event, date: Date): void {
        this._mouseEnterHandled = true;
        if (
            this._options.selectionProcessing ||
            !this._options.monthClickable
        ) {
            this._notify('itemMouseEnter', [date]);
        }
    }

    protected _onMonthMouseLeave(event: Event, date: Date): void {
        if (
            this._options.selectionProcessing ||
            !this._options.monthClickable
        ) {
            this._notify('itemMouseLeave', [date]);
        }
    }

    protected _onMonthKeyDown(event: Event, item: Date): void {
        const itemClass = '.controls-PeriodDialog-MonthsRange__item';
        const mode = 'months';
        this._notify('itemKeyDown', [
            item,
            event.nativeEvent.keyCode,
            itemClass,
            mode,
        ]);
        // Останавливаем нативный скролл, когда управляем выбором через стрелочки клавиатуры
        event.preventDefault();
    }

    protected _dateToDataString(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    }

    protected _prepareItemClass(itemValue: Date): string {
        const css = [];
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
            ) &&
            this._selectionViewType === SELECTION_VIEW_TYPES.months
        ) {
            css.push('controls-PeriodDialog-MonthsRange__item-selected');
        } else {
            css.push('controls-PeriodDialog-MonthsRange__item-unselected');
        }

        if (this._selectionViewType === SELECTION_VIEW_TYPES.months) {
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
        } else if (
            this._options.selectionType !==
            IDateRangeSelectable.SELECTION_TYPES.disable
        ) {
            const hoveredClass: string =
                rangeSelectionUtils.prepareHoveredClass(
                    itemValue,
                    this._options.hoveredStartValue,
                    this._options.hoveredEndValue,
                    {
                        cssPrefix: MONTHS_RANGE_CSS_CLASS_PREFIX,
                        theme: this._options.theme,
                    }
                );
            css.push(hoveredClass);
        }

        return css.join(' ');
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
            ) &&
            this._selectionViewType === SELECTION_VIEW_TYPES.months
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

        return isRangeEnabled(
            date,
            dateUtils.isHalfYearsEqual,
            this._options.isDayAvailable
        );
    }

    private _isQuarterEnabled(date: Date): boolean {
        if (!this._quarterSelectionEnabled) {
            return false;
        }

        if (!this._options.isDayAvailable) {
            return true;
        }

        return isRangeEnabled(
            date,
            dateUtils.isQuartersEqual,
            this._options.isDayAvailable
        );
    }

    private _isMonthEnabled(date: Date): boolean {
        if (!this._options.isDayAvailable) {
            return true;
        }

        return isRangeEnabled(
            date,
            dateUtils.isMonthsEqual,
            this._options.isDayAvailable
        );
    }

    private _calculateRangeSelectedCallback(
        startValue: Date,
        endValue: Date
    ): Date[] {
        let startDate = startValue;
        let endDate = endValue;
        if (this._options.rangeSelectedCallback) {
            const ranges = this._options.rangeSelectedCallback(
                startValue,
                endValue
            );
            startDate = ranges[0];
            endDate = ranges[1];
        }
        return [startDate, endDate];
    }
    private _chooseMonth(date: Date): void {
        if (
            this._isMonthEnabled(date) &&
            (this._options.selectionProcessing || !this._options.monthClickable)
        ) {
            this._selectionViewType = SELECTION_VIEW_TYPES.months;
            this._notify('selectionViewTypeChanged', [this._selectionViewType]);
            this._notify('itemClick', [date]);
        }
    }

    static SELECTION_VIEW_TYPES: object = SELECTION_VIEW_TYPES;

    static getDefaultOptions(): object {
        return coreMerge(
            {
                selectionViewType: SELECTION_VIEW_TYPES.days,
            },
            {} /* IPeriodSimpleDialog.getDefaultOptions()*/
        );
    }
}
