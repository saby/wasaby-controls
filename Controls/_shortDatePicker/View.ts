/**
 * @kaizen_zone d7dff399-200f-4169-9c69-4c54617de7e8
 */
import rk = require('i18n!Controls');
import { Control, TemplateFunction } from 'UI/Base';
import { constants, detection } from 'Env/Env';
import { Date as WSDate, descriptor } from 'Types/entity';
import { default as IPeriodSimpleDialog, IDateLitePopupOptions } from './IDateLitePopup';
import { Base as dateUtils } from 'Controls/dateUtils';
import componentTmpl = require('wml!Controls/_shortDatePicker/DateLitePopup');
import listTmpl = require('wml!Controls/_shortDatePicker/List');
import ItemWrapper = require('wml!Controls/_shortDatePicker/ItemWrapper');
import { date as formatDate } from 'Types/formatter';
import monthTmpl = require('wml!Controls/_shortDatePicker/monthTemplate');
import { Logger } from 'UI/Utils';
import { Utils as dateControlsUtils } from 'Controls/dateRange';
import 'css!Controls/shortDatePicker';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ErrorViewMode, ErrorViewConfig, ErrorController } from 'Controls/error';

const MAX_VISIBLE_YEARS = 5;

/**
 * Контрол выбора даты или периода.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_shortDatePicker.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @mixes Controls/shortDatePicker/IDateLitePopup
 *
 * @implements Controls/interface:IDisplayedRanges
 * @implements Controls/dateRange:ICaptionFormatter
 *
 * @public
 * @demo Controls-demo/ShortDatePicker/Index
 */

/*
 * @name Controls/shortDatePicker:View#displayedRanges
 * @remark
 * Интервал отображаемых периодов должен равняться году
 */

class View extends Control<IDateLitePopupOptions> {
    protected _template: TemplateFunction = componentTmpl;
    protected _defaultListTemplate: TemplateFunction = listTmpl;
    protected _position: Date;
    protected _yearHovered: Date;
    protected _range: Date[];
    protected _limit: number = 15;
    protected _isExpandedPopup: boolean = false;
    protected _isExpandButtonVisible: boolean = true;
    protected _emptyCaption: string = '';
    protected _caption: string = '';
    protected _displayedRanges: Date[];
    protected _prevArrowButtonReadOnly: boolean = false;
    protected _nextArrowButtonReadOnly: boolean = false;
    protected _isHeaderContentTemplateString: boolean;
    protected _tabPressed: boolean = false;
    protected _lastYear: boolean;
    private _errorController: ErrorController;
    protected _errorViewConfig: ErrorViewConfig;
    protected _hovered: boolean = false;
    protected _shadowVisibility: string = 'hidden';

    protected _startValue: Date;
    protected _endValue: Date;

    protected _selectionType: 'quarter' | 'month' | 'halfyear' | null = null;
    protected _selectionBase: Date;

    protected _selectionProcessing: boolean = false;
    protected _slidingOptions: {};

    protected _headerTitle: string = rk('Выбрать год');

    protected _errorCallback(event: Event, error: Error): Promise<unknown> {
        return this._errorController
            .process({
                error,
                mode: ErrorViewMode.dialog,
            })
            .then((errorViewConfig: ErrorViewConfig) => {
                this._errorViewConfig = errorViewConfig;
                return error;
            });
    }

    protected _beforeMount(options: IDateLitePopupOptions): void {
        this._slidingOptions = {
            shouldSwipeOnContent: false
        };
        this._startValue = options.startValue ?
            new options.dateConstructor(options.startValue.getTime()) : options.startValue;
        this._endValue = options.endValue ?
            new options.dateConstructor(options.endValue.getTime()) : options.endValue;
        this._isSelectedPeriod = this._isSelectedPeriod.bind(this);
        this._onYearMouseEnter = this._onYearMouseEnter.bind(this);
        this._onYearMouseLeave = this._onYearMouseLeave.bind(this);
        this._keyUpYearHandler = this._keyUpYearHandler.bind(this);
        this._getYearHeaderVisible = this._getYearHeaderVisible.bind(this);
        this._onYearClick = this._onYearClick.bind(this);

        this._errorController = new ErrorController({});
        this._errorCallback = this._errorCallback.bind(this);

        this._lastYear = options.displayedRanges
            ? options.displayedRanges[0][0]?.getFullYear()
            : null;

        this._isHeaderContentTemplateString = typeof options.headerContentTemplate === 'string';
        this._displayedRanges = options.displayedRanges;
        if (!options.emptyCaption) {
            if (options.chooseMonths && (options.chooseQuarters || options.chooseHalfyears)) {
                this._emptyCaption = rk('Период не указан');
            } else {
                this._emptyCaption = rk('Не указан');
            }
        }
        this._caption = options.captionFormatter(
            options.startValue,
            options.endValue,
            options.emptyCaption
        );

        if (!(options.chooseQuarters && options.chooseMonths) && options.chooseHalfyears) {
            Logger.error(
                'shortDatePicker: Для корректного отображения контрола, при включенной опции отображения полугодий' +
                    '(chooseHalfyears) необходимо также включить опции для отображения кварталов (chooseQuarters) ' +
                    'и месяцев (chooseMonths)',
                this
            );
        }

        if (options.chooseQuarters || options.chooseMonths || options.chooseHalfyears) {
            this._position = this._getPosition(options);
        } else {
            this._position = this._getYearsListPosition(options);
        }

        this._isExpandButtonVisible = this._getExpandButtonVisibility(options);

        if (options.displayedRanges) {
            this._updateArrowButtonsState();
        }
    }

    protected _beforeUpdate(options: IDateLitePopupOptions): void {
        this._isHeaderContentTemplateString = typeof options.headerContentTemplate === 'string';
        this._isExpandButtonVisible = this._getExpandButtonVisibility(options);
        if (options.displayedRanges) {
            this._updateArrowButtonsState();
        }
    }

    /**
     * Sets the current year
     * @param year
     */
    setYear(year: number): void {
        this._position = new this._options.dateConstructor(year, 0, 1);
        this._notify('yearChanged', [year]);
    }

    // Скроем заголовок у первого года, ограниченного displayedRanges что-бы избежать дублирования с шапкой.
    protected _getYearHeaderVisible(yearHeaderDate: Date): boolean {
        return (
            !this._displayedRanges ||
            this._displayedRanges[0][0] === null ||
            yearHeaderDate !== this._displayedRanges[0][0].getFullYear()
        );
    }

    protected _isDisplayed(date: Date): boolean {
        if (!this._displayedRanges || !this._displayedRanges.length) {
            return true;
        }

        for (let i = 0; i < this._displayedRanges.length; i++) {
            if (this._hitsDisplayedRange(date.getFullYear(), i)) {
                return true;
            }
        }
        return false;
    }

    protected _getExpandButtonVisibility(options: IDateLitePopupOptions): boolean {
        // options.stickyPosition может не быть, если shortDatePicker:View используется отдельно
        // от dateRange:RangeShortSelector
        if (detection.isMobilePlatform) {
            return false;
        }

        // Не будем рисовать кнопку развернуть, при маленьком количестве эллементов
        if (options.displayedRanges) {
            const amountOfVisibleItems = options.chooseQuarters && !options.chooseMonths ? 4 : 2;
            let amountOfDisplayedItems = 0;
            for (let i = 0; i < this._displayedRanges.length; i++) {
                const displayedRange = this._displayedRanges[i];
                const startOfRange = displayedRange[0];
                const endOfRange = displayedRange[1];
                if (startOfRange === null || endOfRange === null) {
                    amountOfDisplayedItems = Infinity;
                    break;
                }
                amountOfDisplayedItems += endOfRange.getFullYear() - startOfRange.getFullYear();
            }
            if (amountOfVisibleItems > amountOfDisplayedItems) {
                return false;
            }
        }

        if (options.stickyPosition) {
            const openerTop = options.stickyPosition.targetPosition?.top;
            const popupTop =
                options.stickyPosition.position?.top +
                Math.abs(options.stickyPosition.margins?.top);
            return openerTop === popupTop;
        }
    }

    protected _getMonthListClasses(): string {
        const classes = [];
        if (this._isExpandedPopup) {
            classes.push('controls-PeriodLiteDialog-MonthList_expanded');
        } else if (this._options.stickyPosition) {
            classes.push('controls-PeriodLiteDialog-MonthList-' + this._getSize());
        } else if (this._options.isAdaptive && !!this._options.slidingPanelOptions) {
            classes.push('controls-PeriodLiteDialog-MonthList-isAdaptive');
        }
        return classes.join(' ');
    }

    protected _getYearListClasses(): string {
        const classes = [];
        if (this._options.stickyPosition) {
            classes.push('controls-PeriodLiteDialog__year-list');
        } else if (this._options.isAdaptive && !!this._options.slidingPanelOptions) {
            classes.push('controls-PeriodLiteDialog__year-list_isAdaptive');
        }
        return classes.join(' ');
    }

    protected _dateToDataString(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    }

    protected _onYearMouseEnter(event: Event, year: Date): void {
        if (this._options.chooseYears) {
            this._yearHovered = year;
            if (
                this._options.chooseMonths ||
                this._options.chooseHalfyears ||
                this._options.chooseQuarters
            ) {
                this._hovered = true;
            }
        }
    }

    protected _keyUpHandler(event: SyntheticEvent): void {
        if (event.nativeEvent.keyCode === constants.key.tab) {
            this._tabPressed = true;
        }
    }

    protected _keyUpYearHandler(event: SyntheticEvent, year: Date): void {
        if (event.nativeEvent.keyCode === constants.key.tab) {
            this._tabPressed = true;
            this._yearHovered = year;
        } else if (event.nativeEvent.keyCode === constants.key.enter) {
            this._selectYear(year);
        }
    }

    protected _hitsDisplayedRange(year: number, index: number): boolean {
        let date = new Date(year, 12, 0);
        if (this._options.chooseHalfyears && this._options.chooseQuarters && this._options.chooseMonths) {
            date = new Date(year, 0);
        }
        // Проверяем второй элемент массива на null. Если задан null в опции displayedRanges
        // то лента будет отображаться бесконечно.
        return (
            this._displayedRanges[index][0] <= date &&
            (this._displayedRanges[index][1] === null || this._displayedRanges[index][1] >= date)
        );
    }

    protected _getNextDisplayedYear(year: number, delta: number): number {
        if (!this._displayedRanges) {
            return year + delta;
        }
        let index;
        // Ищем массив в котором находится year.
        for (let i = 0; i < this._displayedRanges.length; i++) {
            if (this._hitsDisplayedRange(year, i)) {
                index = i;
                break;
            }
        }
        // Если мы попали за границы displayedRanges, берем за основу вычислений ближайший элемент снизу.
        if (index === undefined) {
            for (let i = this._displayedRanges.length - 1; i >= 0; i--) {
                if (
                    this._displayedRanges[i][1] < new Date(year, 0) &&
                    this._displayedRanges[i][1] !== null
                ) {
                    index = i;
                    break;
                }
            }
            if (index === undefined) {
                return year;
            }
        }
        // Проверяем год, на который переходим. Если оне не попадает в тот же массив что и year - ищем ближайших год на
        // который можно перейти в следующем массиве
        if (this._hitsDisplayedRange(year + delta, index)) {
            return year + delta;
        } else {
            if (this._displayedRanges[index + delta]) {
                if (delta === 1) {
                    return this._displayedRanges[index + delta][0].getFullYear();
                } else {
                    return this._displayedRanges[index + delta][1].getFullYear();
                }
            }
        }
        return year;
    }

    protected _changeYear(event: Event, delta: number): void {
        const year = this._position.getFullYear();
        let newYear;
        if (this._options.displayedRanges) {
            const amountOfFollowingItems = this._getAmountOfFollowingItems(delta);
            // Ищем последний видимый элемент
            // В случае, если мы лисаем 'Вверх', мы просто устаналиваем ближайший доступный год
            if (
                this._canChangeYear(year, delta, amountOfFollowingItems) ||
                !amountOfFollowingItems
            ) {
                newYear = this._getNextDisplayedYear(year, delta);
            }
        } else {
            newYear = year + delta;
        }
        if (newYear && newYear !== year) {
            this.setYear(newYear);
        }
    }

    private _canChangeYear(year: number, delta: number, amountOfFollowingItems: number): boolean {
        let changedYear = year;
        const yearsNotEqual = () => {
            return changedYear !== this._getNextDisplayedYear(changedYear, delta);
        };

        let index = 0;
        while (yearsNotEqual() && index < amountOfFollowingItems) {
            changedYear = this._getNextDisplayedYear(changedYear, delta);
            index++;
        }
        return yearsNotEqual();
    }

    // Количество элементов, которые нахоятся ниже текущего года, но так же видны
    private _getAmountOfFollowingItems(delta: number): number {
        let amountOfFollowingItems = 0;
        // В режиме 'Только года' элементы строются снизу вверх по возрастанию, а во всех остальных типах - сверху вниз,
        // отсюда и разница в дельтах
        if (delta === 1) {
            if (!this._options.chooseHalfyears && this._options.chooseQuarters) {
                // Помимо текущего года, в режиме 'Только кварталы' отображаются еще 2 года снизу.
                amountOfFollowingItems = 2;
            } else if (this._options.chooseMonths) {
                // Помимо текущего года, в режиме 'Только месяцы' и 'Месяцы, кварталы и полугодия'
                // отображается еще 1 год снизу.
                amountOfFollowingItems = 1;
            }
        } else {
            if (
                !this._options.chooseMonths &&
                !this._options.chooseHalfyears &&
                !this._options.chooseQuarters
            ) {
                // Помимо текущего года, в режиме 'Только года' отображаются еще 5 лет снизу.
                amountOfFollowingItems = MAX_VISIBLE_YEARS;
            }
        }
        return amountOfFollowingItems;
    }

    _updateArrowButtonsState(): void {
        const buttons = {
            arrowDown: {
                delta: 1,
                name: '_nextArrowButtonReadOnly',
            },
            arrowUp: {
                delta: -1,
                name: '_prevArrowButtonReadOnly',
            },
        };
        for (const i in buttons) {
            if (buttons.hasOwnProperty(i)) {
                const amountOfFollowingItems = this._getAmountOfFollowingItems(buttons[i].delta);
                this[buttons[i].name] = !this._canChangeYear(
                    this._position.getFullYear(),
                    buttons[i].delta,
                    amountOfFollowingItems
                );
            }
        }
    }

    protected _onHeaderMouseLeave(): void {
        this._yearHovered = null;
        if (
            this._options.chooseMonths ||
            this._options.chooseHalfyears ||
            this._options.chooseQuarters
        ) {
            this._hovered = false;
        }
    }

    protected _onYearMouseLeave(): void {
        this._yearHovered = null;
    }

    protected _expandPopup(e: SyntheticEvent, value: boolean): void {
        let fittingMode;
        if (!this._isExpandButtonVisible || !this._options.stickyPosition) {
            return;
        } else {
            this._isExpandedPopup = value;
        }

        if (this._isExpandedPopup) {
            fittingMode = 'fixed';
        } else {
            fittingMode = 'overflow';
        }
        this._notify('sendResult', [fittingMode]);
    }

    protected _onHeaderClick(): void {
        this._notify('close', [], {bubbling: true});
    }

    protected _onYearClick(event: Event, year: Date): void {
        if (!this._options.readOnly) {
            this._selectYear(year);
        }
    }

    private _selectYear(year: Date): void {
        const lastMonth: number = 11;
        const lastDay: number = 31;
        if (this._options.chooseYears) {
            this._notify(
                'sendResult',
                [
                    new this._options.dateConstructor(year, 0, 1),
                    new this._options.dateConstructor(year, lastMonth, lastDay),
                ],
                { bubbling: true }
            );
        }
    }

    protected _getTabindex(year: number): number {
        let tabindex = -1;
        if (year <= this._position?.getFullYear() || this._tabPressed) {
            tabindex = 0;
        }
        return tabindex;
    }

    protected _getSizeCssClass(data: string): string {
        if (!this._options.stickyPosition && data === 'height') {
            return '';
        }
        const size = this._getSize();
        return 'controls-PeriodLiteDialog__' + data + '-' + size;
    }

    protected _getSize(): string {
        if (
            this._options.chooseMonths &&
            this._options.chooseHalfyears &&
            this._options.chooseQuarters
        ) {
            return 'large';
        }
        return 'medium';
    }

    protected _onWheelHandler(): void {
        this._shadowVisibility = 'auto';
    }

    protected _getListCssClasses(): string {
        if (this._options.chooseHalfyears) {
            return 'controls-PeriodLiteDialog-item controls-PeriodLiteDialog__fullYear-list';
        }
        if (this._options.chooseMonths && this._options.chooseQuarters) {
            return 'controls-PeriodLiteDialog__monthsAndQuarters';
        }
        if (this._options.chooseMonths) {
            return 'controls-PeriodLiteDialog__vLayout' + ' controls-PeriodLiteDialog__month-list';
        }
        if (this._options.chooseQuarters) {
            return (
                'controls-PeriodLiteDialog__vLayout' + ' controls-PeriodLiteDialog__quarter-list'
            );
        }
        return '';
    }

    protected _getYearWrapperCssClasses(): string {
        if (this._options.chooseHalfyears) {
            return 'controls-PeriodLiteDialog__yearWrapper__fullYear';
        }
        if (this._options.chooseQuarters || this._options.chooseMonths) {
            return 'controls-PeriodLiteDialog__yearWrapper__quarters-months';
        }
        return '';
    }

    protected _getYearCssClasses(): string {
        const css: string[] = [];
        if (this._options.chooseYears) {
            css.push('controls-PeriodLiteDialog__year-clickable');
        }
        if (
            this._options.chooseMonths &&
            this._options.chooseQuarters &&
            this._options.chooseHalfyears
        ) {
            css.push('controls-PeriodLiteDialog__year-medium');
        } else if (this._options.chooseMonths) {
            css.push('controls-PeriodLiteDialog__year-center-lite');
        }
        return css.join(' ');
    }

    protected _isCurrentYear(year: number): boolean {
        return (this._options?._date?.getFullYear() || new Date().getFullYear()) === year;
    }

    protected _getYearItemCssClasses(year: number): string {
        const css: string[] = [];
        const date = this._options.startValue;
        const isValidDate = dateUtils.isValidDate(date);
        if (!isValidDate || year !== date.getFullYear()) {
            css.push('controls-PeriodLiteDialog__vLayoutItem-clickable');
        }
        if (isValidDate && year === date.getFullYear()) {
            css.push('controls-PeriodLiteDialog__selectedYear');
        }
        if (isValidDate && this._isCurrentYear(year)) {
            css.push('controls-PeriodLiteDialog__currentYear');
        }
        return css.join(' ');
    }

    protected _getSelectedYear(): number {
        return this._options.startValue?.getFullYear();
    }

    protected _mouseEnterHandler(): void {
        this._hovered = true;
    }

    protected _mouseLeaveHandler(): void {
        this._hovered = false;
    }

    protected _isSelectedPeriod(date: Date, periodType: string): boolean {
        const getEndValue = () => {
            if (periodType === 'month') {
                return dateUtils.getEndOfMonth(date);
            }
            if (periodType === 'quarter') {
                return dateUtils.getEndOfQuarter(date);
            }
            if (periodType === 'halfyear') {
                return dateUtils.getEndOfHalfyear(date);
            }
            if (periodType === 'year') {
                return dateUtils.getEndOfYear(date);
            }
        };
        const startValue = date;
        const endValue = getEndValue();
        return (
            dateUtils.isDatesEqual(this._startValue, startValue) &&
            dateUtils.isDatesEqual(this._endValue, endValue)
        );
    }

    protected _selectionEnded(): void {
        this._notify('sendResult', [this._startValue, this._endValue], {bubbling: true});
    }

    private _setEndOfPeriod (endValue: Date): void {
        if (endValue > this._endValue) {
            this._endValue = dateUtils.getEndOfMonth(endValue);
        }
        if (this._hoveredItem === 'quarter') {
            this._endValue = dateUtils.getEndOfQuarter(endValue);
        }
        if (this._hoveredItem === 'halfyear') {
            this._endValue = dateUtils.getEndOfHalfyear(endValue);
        }
    }

    protected _rangeChangedHandler(event: Event, startValue: Date, endValue: Date): void {
        this._startValue = startValue;
        if (!dateUtils.isStartOfMonth(startValue)) {
            this._startValue = dateUtils.getStartOfMonth(startValue);
        }
        if (!this._selectionBase) {
            this._selectionBase = this._startValue;
        }
        if (this._selectionType === 'quarter') {
            this._endValue = dateUtils.getEndOfQuarter(this._selectionBase);
            this._setEndOfPeriod(endValue);
            return;
        }
        if (this._selectionType === 'halfyear') {
            this._endValue = dateUtils.getEndOfHalfyear(this._selectionBase);
            this._setEndOfPeriod(endValue);
            return;
        }
        if (this._hoveredItem === 'halfyear') {
            this._startValue = dateUtils.getStartOfHalfyear(startValue);
            this._endValue = dateUtils.getEndOfHalfyear(endValue);
            return;
        }
        if (this._hoveredItem === 'quarter') {
            this._startValue = dateUtils.getStartOfQuarter(startValue);
            this._endValue = dateUtils.getEndOfQuarter(endValue);
            return;
        }
        this._endValue = dateUtils.getEndOfMonth(endValue);
    }

    private _getPosition(options: IDateLitePopupOptions): Date {
        const position = options.year || options.startValue || new options.dateConstructor();
        if (!this._displayedRanges) {
            return position;
        }
        // В ленте календаря видны сразу несколько месяцев
        // В режиме 'Полугодия, кварталы и месяца' и режиме 'Только месяца' помимо выбранного года виден еще 1
        // В режиме 'Только кварталы' помимо выбранного года видны еще 2
        const amountOfVisibleItemsExceptCurrent =
            options.chooseQuarters && !options.chooseMonths ? 2 : 1;

        for (let i = 0; i < this._displayedRanges.length; i++) {
            const displayedRange = this._displayedRanges[i];
            // При открытии мы позиционируем выбранный год сверху.
            // Если окажется так, что выбранный год оказался последним отображаемым из-за displayedRanges,
            // мы не сможем спозиционировать его сверху, т.к. останется пустое место снизу.
            // Спозиционируемся на год выше (или три года, в случае с режимом 'Только кварталы'), чтобы избежать прыжка
            if (displayedRange[1] && displayedRange[1].getFullYear() === position.getFullYear()) {
                return new options.dateConstructor(
                    position.getFullYear() - amountOfVisibleItemsExceptCurrent,
                    0
                );
            }
        }
        return position;
    }

    private _getYearsListPosition(options: IDateLitePopupOptions): Date {
        const start = options.startValue;
        const currentDate = options._date || new options.dateConstructor();
        const startValueYear = start ? start.getFullYear() : null;
        // максимально допустимая разница между текущим и отображаемым годом
        const maxYearsOffset = 6;

        if (!startValueYear) {
            return currentDate;
        }

        if (startValueYear >= currentDate.getFullYear()) {
            return start;
        } else if (currentDate.getFullYear() - startValueYear >= maxYearsOffset) {
            return new options.dateConstructor(startValueYear + maxYearsOffset - 1, 0);
        } else {
            return currentDate;
        }
    }

    private getWindowInnerWidth(): number {
        return window?.innerWidth;
    }

    static getDefaultOptions(): IDateLitePopupOptions {
        const PeriodDialogOptions: IDateLitePopupOptions = IPeriodSimpleDialog.getDefaultOptions();
        PeriodDialogOptions.captionFormatter = dateControlsUtils.formatDateRangeCaption;
        PeriodDialogOptions.itemTemplate = ItemWrapper;
        PeriodDialogOptions.monthTemplate = monthTmpl;
        PeriodDialogOptions.dateConstructor = WSDate;
        PeriodDialogOptions.arrowVisible = true;
        return PeriodDialogOptions;
    }

    static getOptionTypes(): IDateLitePopupOptions {
        const PeriodDialogTypes: IDateLitePopupOptions = IPeriodSimpleDialog.getOptionTypes();
        PeriodDialogTypes.captionFormatter = descriptor(Function);
        return PeriodDialogTypes;
    }
}

View.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

export default View;
