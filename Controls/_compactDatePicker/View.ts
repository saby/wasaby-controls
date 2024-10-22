/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import { getFormattedCaption } from 'Controls/_compactDatePicker/Utils';
import { IShouldPositionBelowOptions } from 'Controls/calendar';
import { Utils as DateControlsUtils, DateRangeModel, IDateRangeOptions } from 'Controls/dateRange';
import { Base as dateUtils } from 'Controls/dateUtils';
import { IDisplayedRangesOptions } from 'Controls/interface';
import { Date as WSDate } from 'Types/entity';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import 'css!Controls/compactDatePicker';
import * as template from 'wml!Controls/_compactDatePicker/View';

/**
 * Диалоговое окно компактного выбора периода
 *
 * @class Controls/compactDatePicker:View
 * @extends UI/Base:Control
 * @implements Controls/dateRange:IDateRangeSelectable
 * @implements Controls/dateRange:IDateRange
 * @implements Controls/interface:IDisplayedRanges
 * @implements Controls/calendar:IMonthListSource
 * @implements Controls/interface:IDayTemplate
 * @implements Controls/calendar:IDayAvailable
 * @implements Controls/calendar:IShouldPositionBelow
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
 * @name Controls/compactDatePicker:View#size
 * @cfg {String} Размер компактного выбора периода.
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/CompactDatePicker/Size/Index
 */

/**
 * @name Controls/compactDatePicker:View#position
 * @cfg {Date} Месяц, который отображается первым вверху скролируемой области.
 * @remark
 * При изменении значения лента скролится к новому месяцу.
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

/**
 * @name Controls/compactDatePicker:View#counterClickCallback
 * @cfg {Function} Коллбек-функция, которая обрабатывает клик на счетчик
 * @remark В качестве аргумента получит дату, по счетчику которой, произашел клик
 */

/**
 * @name Controls/compactDatePicker:View#dayClickCallback
 * @cfg {Function} Коллбек-функция, которая обрабатывает клик на день
 * @remark В качестве аргумента получит дату, данные дня из сорса и доступность выбора дня полученной из {@link Controls/calendar:IDayAvailable}
 */

/**
 * @name Controls/compactDatePicker:View#selectionStyle
 * @cfg {String} Цвет обводки
 * @demo Controls-demo/CompactDatePicker/SelectionStyle/Index
 * @variant default
 * @variant brand
 * @default default
 */

/**
 * @name Controls/compactDatePicker:View#counterProperty
 * @cfg {String} Имя поля в extData, которое хранит счётчик. extData приходит в качестве ответа при загрузке {@link Controls/calendar:IMonthListSource#source source}.
 * <pre>
 *     <Controls.compactDatePicker:View counterProperty='mainCounter' source="{{source}}" />
 *
 *     [
 *       {
 *           id: '2019-09-01',
 *           extData: {
 *               mainCounter: 1
 *           }
 *       }, {
 *           id: '2019-10-01',
 *           extData: {
 *              mainCounter: 7
 *           }
 *       }
 *     ]
 * </pre>
 * @remark При указании данной опции изменяется отображение календаря. Добавятся отступы между неделями и изменится выделение периода.
 * @demo Controls-demo/CompactDatePicker/CounterProperty/Index
 */

/**
 * @name Controls/compactDatePicker:View#addButtonVisibilityCallback
 * @cfg {Function} Коллбек функция, которая определяет, отображать ли кнопку плюс при наведении на ячейку дня.
 * @demo Controls-demo/CompactDatePicker/AddButtonVisibilityCallback/Index
 * @remark
 * В качестве аргумента, в функцию будет передана дата дня, на который навели. Результатом функции должно быть булевое значение.
 *
 * true - отображать кнопку плюс.
 * false - не отображать кнопку плюс.
 * По умолчанию, если не передать опцию, будут кнопка плюс будет отображаться везде.
 */

/**
 * @name Controls/compactDatePicker:View#headerMonthCaptionVisible
 * @cfg {Boolean} Определяет, будет ли отображаться название месяца в шапке.
 * @demo Controls-demo/CompactDatePicker/HeaderContentOptions/Index
 * @default true
 */

/**
 * @name Controls/compactDatePicker:View#headerWeekdaysVisible
 * @cfg {Boolean} Определяет, будут ли отображаться дни недели в шапке.
 * @demo Controls-demo/CompactDatePicker/HeaderContentOptions/Index
 * @default true
 */

interface ICompactDatePickerOptions
    extends IControlOptions,
        IDateRangeOptions,
        IDisplayedRangesOptions,
        IShouldPositionBelowOptions {
    position: Date;
    size: 'm' | 'l';
    headerMonthCaptionVisible?: boolean;
    headerWeekdaysVisible?: boolean;
    dayTemplateOptions?: object;
    counterProperty?: string;
    counterClickCallback?: (event: Event, item: unknown) => any;
    selectionStyle?: 'default' | 'brand';
    addButtonVisibilityCallback?: (day: Date) => boolean;
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

    protected _hovered: boolean = false;
    protected _selectionProcessing: boolean = false;
    protected _slidingOptions: {};

    protected _beforeMount(options: ICompactDatePickerOptions): void {
        this._slidingOptions = {
            shouldSwipeOnContent: false,
        };
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
        if (
            this._position.getFullYear() !== currentPeriod.getFullYear() ||
            this._position.getMonth() !== currentPeriod.getMonth()
        ) {
            this._updateTodayIconVisible(true, options.displayedRanges, options._date);
        }
    }

    protected _beforeUpdate(options: ICompactDatePickerOptions): void {
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

    private _updateTodayIconVisible(
        newState: boolean,
        displayedRanges: Date[][],
        mockedDate: Date
    ): void {
        const date = mockedDate || new WSDate();
        if (dateUtils.hitsDisplayedRanges(date, displayedRanges)) {
            this._todayIconVisible = newState;
        } else {
            this._todayIconVisible = false;
        }
    }

    protected _todayIconVisibleChangedHandler(_: Event, todayIconVisible: boolean): void {
        this._updateTodayIconVisible(
            todayIconVisible,
            this._options.displayedRanges,
            this._options._date
        );
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

    protected _onMonthSelectionProcessingChanged(event: Event, state: boolean): void {
        this._monthSelectionProcessing = state;
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
        selectionStyle: 'default',
        headerWeekdaysVisible: true,
        headerMonthCaptionVisible: true,
    };
}
