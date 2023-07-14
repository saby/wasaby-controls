/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as coreMerge from 'Core/core-merge';
import { Date as WSDate, Model } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import IMonth from './interfaces/IMonth';
import Slider from './MonthSlider/Slider';
import { Utils as calendarUtils } from 'Controls/dateRange';
import { Base as DateUtil } from 'Controls/dateUtils';
import monthTmpl = require('wml!Controls/_calendar/MonthSlider/MonthSlider');
import { controller } from 'I18n/i18n';
import { SyntheticEvent } from 'UI/Events';
import 'css!Controls/calendar';

/**
 * Календарь, который отображает 1 месяц и позволяет переключаться на следующий и предыдущий месяцы с помощью кнопок.
 * Предназначен для выбора даты или периода в пределах нескольких месяцев или лет.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_calendar.less переменные тем оформления}
 *
 * @class Controls/_calendar/MonthSlider
 * @extends UI/Base:Control
 * @mixes Controls/calendar:IMonth
 * @mixes Controls/dateRange:IRangeSelectable
 * @implements Controls/dateRange:IDateRangeSelectable
 * @implements Controls/dateRange:IDateRange
 * @implements Controls/dateRange:IDayTemplate
 * @implements Controls/interface:IDisplayedRanges
 * @public
 * @demo Controls-demo/Calendar/MonthSlider/SelectionType/Index
 * @demo Controls-demo/Calendar/MonthSlider/ReadOnly/Index
 *
 */
export { default as Base } from './MonthSlider/Slider';

export default class MonthSlider extends Control<IControlOptions> {
    _template: TemplateFunction = monthTmpl;
    _month: Date;
    _animation: object = Slider.ANIMATIONS.slideLeft;
    _isHomeVisible: boolean = true;
    _days: object[] = [];
    _formatDate: Date = formatDate;
    protected _directionality: string = controller.currentLocaleConfig.directionality;

    protected _prevArrowButtonVisible: boolean;
    protected _nextArrowButtonVisible: boolean;

    protected _beforeMount(options: object): void {
        this._days = calendarUtils.getWeekdaysCaptions();
        this._setMonth(options.month, true, options.dateConstructor, options.displayedRanges);
        this._updateArrowButtonVisible(options.displayedRanges, options.month);
    }

    protected _beforeUpdate(options: object): void {
        this._days = calendarUtils.getWeekdaysCaptions();
        this._setMonth(options.month, true, options.dateConstructor, options.displayedRanges);
        this._updateArrowButtonVisible(options.displayedRanges, options.month);
    }

    protected _wheelHandler(event: SyntheticEvent<WheelEvent>): void {
        event.preventDefault();
        if (event.nativeEvent.deltaY < 0) {
            this._slideMonth(null, 1);
        } else if (event.nativeEvent.deltaY > 0) {
            this._slideMonth(null, -1);
        }
    }

    protected _updateArrowButtonVisible(displayedRanges: Date[][], date: Date): void {
        if (!displayedRanges) {
            this._prevArrowButtonVisible = true;
            this._nextArrowButtonVisible = true;
            return;
        }
        const normalizedDate = DateUtil.getStartOfMonth(date);
        const firstDate = displayedRanges[0][0];
        const amountOfRanges = displayedRanges.length;
        const lastDate = displayedRanges[amountOfRanges - 1][1];
        this._prevArrowButtonVisible = firstDate < normalizedDate || firstDate === null;
        this._nextArrowButtonVisible = lastDate > normalizedDate || lastDate === null;
    }

    protected _itemClickHandler(event: Event, item: Model): void {
        this._notify('itemClick', [item]);
    }

    protected _onStartValueChanged(event: Event, value: Date): void {
        this._notify('startValueChanged', [value]);
    }

    protected _onEndValueChanged(event: Event, value: Date): void {
        this._notify('endValueChanged', [value]);
    }

    protected _rangeChangedHandler(event: Date, startValue: Date, endValue: Date): void {
        this._notify('rangeChanged', [startValue, endValue]);
    }

    private _slideMonth(event: Event, delta: number): void {
        const newDate = new this._options.dateConstructor(
            this._month.getFullYear(),
            this._month.getMonth() + delta,
            1
        );
        if (this._options.displayedRanges) {
            for (const range of this._options.displayedRanges) {
                if (range[0] <= newDate && range[1] >= newDate) {
                    this._setMonth(newDate, false, this._options.dateConstructor);
                }
            }
        } else {
            this._setMonth(newDate, false, this._options.dateConstructor);
        }
    }

    protected _setCurrentMonth(): void {
        this._setMonth(
            DateUtil.normalizeDate(new this._options.dateConstructor()),
            false,
            this._options.dateConstructor
        );
    }

    private _setMonth(
        month: Date,
        silent: boolean,
        dateConstructor: Function,
        displayedRanges?: Date[][]
    ): void {
        if (DateUtil.isDatesEqual(month, this._month)) {
            return;
        }
        this._animation =
            month < this._month ? Slider.ANIMATIONS.slideRight : Slider.ANIMATIONS.slideLeft;
        this._month = month;
        this._isHomeVisible = this._getHomeVisible(
            month,
            dateConstructor,
            displayedRanges || this._options.displayedRanges
        );
        if (!silent) {
            this._notify('monthChanged', [month]);
        }
    }

    private _getHomeVisible(
        month: Date,
        dateConstructor: Function,
        displayedRanges: Date[][]
    ): boolean {
        const currentDate = new dateConstructor();
        const isCurrentMonth = DateUtil.isMonthsEqual(month, currentDate);
        const canBeDisplayed = DateUtil.hitsDisplayedRanges(currentDate, displayedRanges);

        return !isCurrentMonth && canBeDisplayed;
    }

    static getOptionTypes(): object {
        return coreMerge(IMonth.getOptionTypes());
    }

    static getDefaultOptions(): object {
        return {
            ...IMonth.getDefaultOptions(),
            dateConstructor: WSDate,
        };
    }
}
