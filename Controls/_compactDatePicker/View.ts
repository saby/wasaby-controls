/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_compactDatePicker/View';
import { Date as WSDate } from 'Types/entity';
import { Base as dateUtils } from 'Controls/dateUtils';
import { Utils as DateControlsUtils, DateRangeModel, IDateRangeOptions } from 'Controls/dateRange';
import { IDisplayedRangesOptions } from 'Controls/interface';
import { getFormattedCaption } from 'Controls/_compactDatePicker/Utils';
import 'css!Controls/compactDatePicker';

/**
 * Диалоговое окно компактного выбора периода
 *
 * @class Controls/compactDatePicker:View
 * @extends UI/Base:Control
 * @implements Controls/dateRange:IDateRangeSelectable
 * @implements Controls/dateRange:IDateRange
 * @implements Controls/interface:IDisplayedRanges
 * @implements Controls/calendar:IMonthListSource
 *
 * @remark
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FCompactDatePicker%2FFullDemo%2FIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-21.6000/Controls-default-theme/variables/_compactDatePicker.less переменные тем оформления}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/date-time/compact-selector/ руководство разработчика}
 *
 *
 * @public
 * @author Ковалев Г.Д.
 * @demo Controls-demo/CompactDatePicker/Index
 *
 */

/**
 * @name Controls/compactDatePicker:View#isDayAvailable
 * @cfg {Function} Коллбек-функция, которая определяет, может ли пользователь выбирать конкретный день.
 * @remark
 * Функция должна возвращать булевое значение.
 * Формат функции обратного вызова (date: Date, extData: Model) => bool.
 * Если задан источник данных - вторым аргументом в коллбек-функцию придет модель данных даты.
 * @example
 * <pre>
 *     <Controls.compactDatePicker:View
 *          bind:startValue="_value"
 *          bind:endValue="_value"
 *          selectionType="single"
 *          isDayAvailable="{{ _isDayAvailable }}"
 *     />
 * </pre>
 * <pre>
 *     protected _isDayAvailable(date: Date): boolean {
 *      // Заблокируем выбор всех понедельников и четвергов
 *      return date.getDay() !== 1 && date.getDay() !== 4;
 *  }
 * </pre>
 * @demo Controls-demo/CompactDatePicker/IsDayAvailable/Index
 */

/**
 * @name Controls/compactDatePicker:View#size
 * @cfg {String} Размер компактного выбора периода.
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/CompactDatePicker/Size/Index
 */

/**
 * @name Controls/compactDatePicker:View#backgroundStyle
 * @cfg {String} Цвет фона компактного выбора периода.
 * @variant unaccented
 * @variant active
 * @default unaccented
 */

/**
 * @name Controls/compactDatePicker:View#dayTemplateOptions
 * @cfg {Object} Опции шаблона переданного в dayTemplate.
 */

interface ICompactDatePickerOptions
    extends IControlOptions,
        IDateRangeOptions,
        IDisplayedRangesOptions {
    position: Date;
    size: 'm' | 'l';
    headerVisible?: boolean;
    dayTemplateOptions?: object;
}

export default class CompactDatePicker extends Control<ICompactDatePickerOptions> {
    _template: TemplateFunction = template;
    protected _position: Date;
    protected _headerCaption: string;
    protected _weekdaysCaptions: string = DateControlsUtils.getWeekdaysCaptions();
    protected _rangeModel: DateRangeModel;
    protected _todayIconVisible: boolean = false;
    protected _today: number;
    protected _getFormattedCaption: Function = getFormattedCaption;
    protected _topShadowVisibility: string;

    protected _hovered: boolean = false;
    protected _selectionProcessing: boolean = false;

    protected _beforeMount(options: ICompactDatePickerOptions): void {
        this._topShadowVisibility = options.topShadowVisibility || 'hidden';
        // _date только для тестов, чтобы замокать текущий день
        this._today = options._date ? options._date.getDate() : new WSDate().getDate();
        const getFormattedPosition = () => {
            if (options.position) {
                return options.position;
            }
            let date;
            if (dateUtils.isValidDate(options.startValue)) {
                date = options.startValue;
            } else {
                date = new WSDate();
            }
            return dateUtils.getStartOfMonth(date);
        };
        this._position = getFormattedPosition();
        this._headerCaption = this._getFormattedCaption(this._position, options._date);
        this._rangeModel = new DateRangeModel();
        this._rangeModel.update(options);
        // В случае, если при маунте мы находимся не на текущем месяце, IntersectionObserver, находящийся на текущем
        // дне, не инициализируется. В таком случае мы не будем знать, нужно ли показывать кнопку 'Домой'. Сами
        // посчитаем видимость кнопки
        const currentPeriod = options._date || new WSDate();
        if (this._position.getFullYear() !== currentPeriod.getFullYear() ||
            this._position.getMonth() !== currentPeriod.getMonth()) {
            this._updateTodayIconVisible(true, options.displayedRanges);
        }
    }

    protected _beforeUpdate(options: ICompactDatePickerOptions): void {
        if (this._options.topShadowVisibility !== options.topShadowVisibility) {
            this._topShadowVisibility = options.topShadowVisibility;
        }
        if (options.position && options.position !== this._position) {
            this._position = options.position;
            this._headerCaption = this._getFormattedCaption(this._position, options._date);
        }
        if (this._options.startValue !== options.startValue) {
            this._rangeModel.startValue = options.startValue;
        }
        if (this._options.endValue !== options.endValue) {
            this._rangeModel.endValue = options.endValue;
        }
        if (options.selectionProcessing !== this._options.selectionProcessing) {
            this._selectionProcessing = options.selectionProcessing;
        }
    }

    protected _beforeUnmount(): void {
        this._rangeModel.destroy();
    }

    private _updateTodayIconVisible(newState: boolean, displayedRanges: Date[][]): void {
        const date = this._options._date || new WSDate();
        if (dateUtils.hitsDisplayedRanges(date, displayedRanges)) {
            this._todayIconVisible = newState;
        } else {
            this._todayIconVisible = false;
        }
    }

    protected _todayIconVisibleChangedHandler(todayIconVisible: boolean): void {
        this._updateTodayIconVisible(todayIconVisible, this._options.displayedRanges);
    }

    protected _positionChangedHandler(event: Event, position: Date): void {
        this._headerCaption = this._getFormattedCaption(this._position, this._options._date);
        this._notify('positionChanged', [position]);
    }

    protected _scrollToCurrentDate(): void {
        const date = this._options._date || new WSDate();
        this._position = dateUtils.getStartOfMonth(date);
        this._headerCaption = this._getFormattedCaption(this._position, date);
        this._notify('positionChanged', [this._position]);
    }

    protected _scrollHandler(): void {
        // Будем показывать тень только после того как пользователь проскроллил
        if (this._topShadowVisibility === 'hidden') {
            this._notify('topShadowVisibilityChanged', ['auto']);
            this._topShadowVisibility = 'auto';
        }
    }

    protected _mouseEnterHandler(): void {
        this._hovered = true;
        this._notify('hoveredChanged', [true]);
    }

    protected _mouseLeaveHandler(): void {
        this._hovered = false;
        this._notify('hoveredChanged', [false]);
    }

    protected _rangeChangedHandler(event: Event, startValue: Date, endValue: Date): void {
        this._rangeModel.startValue = startValue;
        this._rangeModel.endValue = endValue;
        this._notify('rangeChanged', [this._rangeModel.startValue, this._rangeModel.endValue]);
    }

    protected _dateRangeSelectionEndedHandler(
        event: Event,
        startValue: Date,
        endValue: Date
    ): void {
        this._notify(
            'sendResult',
            [startValue || this._rangeModel.startValue, endValue || this._rangeModel.endValue],
            { bubbling: true }
        );
    }

    protected _itemClickHandler(event: Event, item: Date, clickEvent: Event, extData: {}): void {
        this._notify('itemClick', [item, extData]);
    }

    protected _proxyEvent(event: Event): void {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    }

    static defaultProps: object = {
        size: 'm',
        backgroundStyle: 'unaccented',
        headerVisible: true,
    };
}
