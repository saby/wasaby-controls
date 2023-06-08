/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopupNew/DateRange';
import * as monthHeaderTmpl from 'wml!Controls/_datePopupNew/DateRangeMonthHeaderTemplate';
import { Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    DateRangeModel,
    Utils as DateControlsUtils,
    IDateRangeOptions,
} from 'Controls/dateRange';
import { EventUtils } from 'UI/Events';
import { MonthModel } from 'Controls/calendar';
import { Base as dateUtils } from 'Controls/dateUtils';
import { detection } from 'Env/Env';
import {
    IRangeSelectableOptions,
    IDateRangeSelectableOptions,
} from 'Controls/dateRange';
import { IDateConstructorOptions } from 'Controls/interface';
import isEmpty = require('Core/helpers/Object/isEmpty');
import { getFormattedCaption } from 'Controls/compactDatePicker';
import 'css!Controls/datePopupNew';

interface IDatePopupDateRangeOptions
    extends IControlOptions,
        IDateConstructorOptions,
        IRangeSelectableOptions,
        IDateRangeSelectableOptions,
        IDateRangeOptions {
    position: Date;
}

/**
 * Component that allows you to select periods of multiple days.
 *
 * @class Controls/_datePopup/DateRange
 * @extends UI/Base:Control
 *
 * @private
 */

export default class DateRange extends Control<IDatePopupDateRangeOptions> {
    protected _template: TemplateFunction = template;
    protected _monthHeaderTmpl: TemplateFunction = monthHeaderTmpl;
    protected _monthViewModel: MonthModel = MonthModel;
    protected _weekdaysCaptions: string =
        DateControlsUtils.getWeekdaysCaptions();
    protected _monthSelectionEnabled: boolean = true;
    protected _markedKey: string;

    private _rangeModel: typeof DateRangeModel;
    private _position: Date;
    private _monthsPosition: Date;

    private _singleDayHover: boolean = true;

    constructor(options: IDatePopupDateRangeOptions, context?: object) {
        super(options, context);
        this._rangeModel = new DateRangeModel({
            dateConstructor: options.dateConstructor,
        });
        EventUtils.proxyModelEvents(this, this._rangeModel, [
            'startValueChanged',
            'endValueChanged',
        ]);
        // Нет необходимости передавать опцию hoveredStartValue и hoveredEndValue, если ховер работает только по одному
        // итему, а не по нескольким, как в квантах.
        const isQuantumSelection =
            options.selectionType === 'quantum' && options.ranges;
        let isSingleDayQuantum;
        if (isQuantumSelection) {
            isSingleDayQuantum =
                'days' in options.ranges &&
                options.ranges.days.indexOf(1) !== -1;
        }
        if (
            options.selectionType === 'workdays' ||
            (isQuantumSelection && !isSingleDayQuantum)
        ) {
            this._singleDayHover = false;
        }
    }

    protected _beforeMount(options: IDatePopupDateRangeOptions): void {
        if (options.position) {
            this._monthsPosition = new Date(options.position.getFullYear(), 0);
            const markedKeyDate = new Date(
                options.position.getFullYear(),
                options.position.getMonth()
            );
            this._markedKey = this._dateToId(markedKeyDate);
        }
        this._updateView(options);
    }

    protected _beforeUpdate(options: IDatePopupDateRangeOptions): void {
        this._updateView(options);
    }

    protected _beforeUnmount(): void {
        this._rangeModel.destroy();
    }

    private _dateToId(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    }

    /**
     * [текст, условие, если true, если false]
     * @param prefix
     * @param style
     * @param cfgArr
     * @private
     */
    protected _prepareCssClass(
        prefix: string,
        style: string,
        cfgArr: []
    ): string {
        let cssClass = prefix;
        if (style) {
            cssClass += '-' + style;
        }
        return cfgArr.reduce((previousValue: string, currentValue: string) => {
            const valueToAdd = currentValue[0]
                ? currentValue[1]
                : currentValue[2];
            if (valueToAdd) {
                return previousValue + '-' + valueToAdd;
            }
            return previousValue;
        }, cssClass);
    }

    protected _onItemClick(event: Event): void {
        event.stopPropagation();
    }

    protected _itemKeyDownHandler(
        event: Event,
        item: object,
        keyCode: number
    ): void {
        this._notify('itemKeyDown', [item, keyCode]);
    }

    protected _scrollToMonth(event: Event, year: number, month: number): void {
        const newDate = new this._options.dateConstructor(year, month);
        this._notifyPositionChanged(newDate);
        if (newDate.getFullYear() !== this._monthsPosition.getFullYear()) {
            this._monthsPosition = new this._options.dateConstructor(
                newDate.getFullYear(),
                0
            );
        }
        this._markedKey = this._dateToId(newDate);
        event.stopPropagation();
    }

    protected _formatMonth(month: number): string {
        // Берем любой год, т.к. нам важен только месяц для форматирования.
        const year = 2000;
        return formatDate(new Date(year, month), 'MMMM');
    }

    protected _onPositionChanged(e: Event, position: Date): void {
        if (this._position.getFullYear() !== position.getFullYear()) {
            this._monthsPosition = dateUtils.getStartOfYear(position);
        }
        this._markedKey = this._dateToId(position);
        this._position = position;
        this._notifyPositionChanged(position);
    }

    protected _onMonthsPositionChanged(e: Event, position: Date): void {
        let positionChanged;
        let newPosition;
        // При скролле колонки с месяцами нужно менять позицию календаря только тогда,
        // когда мы увидим следующий год полностью.
        // Позицией у MonthList считается самый верхний видимый год.

        // При скролле вверх будем считать год поностью видимым тогда, когда над ним хотя бы немного виден
        // следующий год. В таком случае позиция MonthList будет установлена на год выше нужного.
        const needChangeToPrevYear =
            position.getFullYear() + 2 === this._position.getFullYear();
        // При скролле вниз, год станет полностью видимым одновременно с тем, как поменяется позиция. Меняем год сразу.
        const needChangeToNextYear =
            position.getFullYear() - 1 === this._position.getFullYear();

        if (needChangeToPrevYear) {
            newPosition = new Date(position.getFullYear() + 1, 0);
            positionChanged = true;
        }

        if (needChangeToNextYear) {
            newPosition = new Date(position.getFullYear(), 0);
            positionChanged = true;
        }
        if (positionChanged) {
            this._markedKey = this._dateToId(newPosition);
            this._notifyPositionChanged(newPosition);
        }
    }

    protected _formatCaption(date: Date): string {
        return getFormattedCaption(date);
    }

    protected _isCurrentYear(year: number): boolean {
        return year === new Date().getFullYear();
    }

    protected _preventEvent(event: Event): void {
        // Отключаем скролл ленты с месяцами, если свайпнули по колонке с месяцами
        // Для тач-устройств нельзя остановить событие скрола, которое стреляет с ScrollContainer,
        // внутри которого лежит 2 контейнера для которых требуется разное поведение на тач устройствах
        event.preventDefault();
        event.stopPropagation();
    }

    protected _proxyEvent(event: Event): void {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    }

    private _updateView(options: IDatePopupDateRangeOptions): void {
        this._rangeModel.update(options);
        const monthSelectionEnabled = (quantum) => {
            return (
                !quantum ||
                isEmpty(quantum) ||
                ('months' in quantum && quantum.months.indexOf(1) !== -1)
            );
        };
        this._monthSelectionEnabled =
            !options.readOnly &&
            (options.selectionType === 'range' ||
                (options.selectionType === 'quantum' &&
                    monthSelectionEnabled(options.ranges) &&
                    options.ranges.months[0] === 1));
        if (this._position !== options.position) {
            this._position = options.position;
            this._markedKey = this._dateToId(this._position);
            this._monthsPosition = dateUtils.getStartOfYear(this._position);
        }
        if (!this._singleDayHover) {
            this._hoveredStartValue = options.hoveredStartValue;
            this._hoveredEndValue = options.hoveredEndValue;
        }
    }

    private _notifyPositionChanged(position: Date): void {
        this._notify('positionChanged', [position]);
    }

    static getDefaultOptions(): object {
        return {
            dateConstructor: WSDate,
        };
    }
}
