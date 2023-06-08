/**
 * @kaizen_zone d7dff399-200f-4169-9c69-4c54617de7e8
 */
import rk = require('i18n!Controls');
import { Control, TemplateFunction } from 'UI/Base';
import { constants, detection } from 'Env/Env';
import { Date as WSDate, descriptor } from 'Types/entity';
import {
    default as IPeriodSimpleDialog,
    IDateLitePopupOptions,
} from './IDateLitePopup';
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
import {
    ErrorViewMode,
    ErrorViewConfig,
    ErrorController,
} from 'Controls/error';

const MAX_VISIBLE_YEARS = 5;

/**
 * Контрол выбора даты или периода.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_shortDatePicker.less переменные тем оформления}
 *
 * @class Controls/shortDatePicker:View
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
        this._isSelectedPeriod = this._isSelectedPeriod.bind(this);
        this._errorController = new ErrorController({});
        this._errorCallback = this._errorCallback.bind(this);
        if (!this._validateDisplayedRanges(options.displayedRanges)) {
            Logger.error(
                'Controls/shortDatePicker:View: интервал отображаемых периодов' +
                    ' в опции displayedRanges должен равняться году'
            );
        }

        this._lastYear = options.displayedRanges
            ? options.displayedRanges[0][0]?.getFullYear()
            : null;

        this._isHeaderContentTemplateString =
            typeof options.headerContentTemplate === 'string';
        this._displayedRanges = options.displayedRanges;
        if (!options.emptyCaption) {
            if (
                options.chooseMonths &&
                (options.chooseQuarters || options.chooseHalfyears)
            ) {
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

        if (
            !(options.chooseQuarters && options.chooseMonths) &&
            options.chooseHalfyears
        ) {
            Logger.error(
                'shortDatePicker: Для корректного отображения контрола, при включенной опции отображения полугодий' +
                    '(chooseHalfyears) необходимо также включить опции для отображения кварталов (chooseQuarters) ' +
                    'и месяцев (chooseMonths)',
                this
            );
        }

        if (
            options.chooseQuarters ||
            options.chooseMonths ||
            options.chooseHalfyears
        ) {
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
        this._isHeaderContentTemplateString =
            typeof options.headerContentTemplate === 'string';
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

    private _validateDisplayedRanges(displayedRanges: Date[][]): boolean {
        if (!displayedRanges) {
            return true;
        }
        for (const range of displayedRanges) {
            if (
                (range[0] !== null && !dateUtils.isStartOfYear(range[0])) ||
                (range[1] !== null && !dateUtils.isStartOfYear(range[1]))
            ) {
                return false;
            }
        }
        return true;
    }

    // Скроем заголовок у первого года, ограниченного displayedRanges что-бы избежать дублирования с шапкой.
    protected _getYearHeaderVisible(yearHeaderDate: Date): boolean {
        return (
            !this._displayedRanges ||
            this._displayedRanges[0][0] === null ||
            yearHeaderDate !== this._displayedRanges[0][0].getFullYear()
        );
    }

    protected _getFirstPositionInMonthList(
        srcPosition: Date,
        dateConstructor: Function
    ): Date {
        if (!this._displayedRanges) {
            return srcPosition;
        }

        const calcDisplayedPositionByDelta = (delta) => {
            let tempPosition;
            while (countDisplayedRanges < this._limit) {
                checkingPosition = this._shiftRange(
                    checkingPosition,
                    delta,
                    dateConstructor
                );
                if (!this._isDisplayed(checkingPosition)) {
                    const period = this._getHiddenPeriod(
                        checkingPosition,
                        dateConstructor
                    );
                    tempPosition = delta > 0 ? period[1] : period[0];
                    if (!tempPosition) {
                        break;
                    }
                } else {
                    lastDisplayedPosition = new Date(
                        checkingPosition.getTime()
                    );
                    countDisplayedRanges++;
                }
            }
        };

        let countDisplayedRanges = 1;
        let lastDisplayedPosition = new Date(srcPosition.getTime());
        let checkingPosition = new Date(srcPosition.getTime());

        // Вначале от изначальной даты идём вниз (напр. от 2020 к 2019, 2018 и тд)
        calcDisplayedPositionByDelta(-1);
        // Восстаналиваем начальную позицию и идем от даты вверх (напр. от 2020 к 2021, 2022 и тд)
        checkingPosition = new Date(srcPosition.getTime());
        calcDisplayedPositionByDelta(1);

        return lastDisplayedPosition;
    }

    protected _shiftRange(
        date: Date,
        delta: number,
        dateConstructor: Function
    ): Date {
        return new dateConstructor(date.getFullYear() + delta, 0);
    }

    // Получить неотображаемый период в который попадает переданная дата
    protected _getHiddenPeriod(date: Date, dateConstructor: Function): Date[] {
        let range: Date[] = [];
        for (let i = 0; i < this._displayedRanges.length; i++) {
            range = this._displayedRanges[i];
            // После 1970 года проверка на то, что дата больше чем null не работает
            if (date < range[0] && range[0] !== null) {
                const startHiddenPeriod =
                    i === 0
                        ? null
                        : this._shiftRange(
                              this._displayedRanges[i - 1][1],
                              1,
                              dateConstructor
                          );
                const endHiddenPeriod = this._shiftRange(
                    range[0],
                    -1,
                    dateConstructor
                );
                return [startHiddenPeriod, endHiddenPeriod];
            }
        }
        return [
            range[1] ? this._shiftRange(range[1], 1, dateConstructor) : date,
            null,
        ];
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

    protected _getExpandButtonVisibility(
        options: IDateLitePopupOptions
    ): boolean {
        // options.stickyPosition может не быть, если shortDatePicker:View используется отдельно
        // от dateRange:RangeShortSelector
        if (detection.isMobilePlatform) {
            return false;
        }

        // Не будем рисовать кнопку развернуть, при маленьком количестве эллементов
        if (options.displayedRanges) {
            const amountOfVisibleItems =
                options.chooseQuarters && !options.chooseMonths ? 4 : 2;
            let amountOfDisplayedItems = 0;
            for (let i = 0; i < this._displayedRanges.length; i++) {
                const displayedRange = this._displayedRanges[i];
                const startOfRange = displayedRange[0];
                const endOfRange = displayedRange[1];
                if (startOfRange === null || endOfRange === null) {
                    amountOfDisplayedItems = Infinity;
                    break;
                }
                amountOfDisplayedItems +=
                    endOfRange.getFullYear() - startOfRange.getFullYear();
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
            classes.push(
                'controls-PeriodLiteDialog-MonthList-' + this._getSize()
            );
        }
        return classes.join(' ');
    }

    protected _getYearListClasses(): string {
        const classes = [];
        if (this._options.stickyPosition) {
            classes.push('controls-PeriodLiteDialog__year-list');
        }
        return classes.join(' ');
    }

    protected _dateToDataString(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    }

    protected _onHeaderMouseEnter(event: Event, year: Date): void {
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

    protected _onBlurYear(): void {
        this._yearHovered = null;
    }

    protected _hitsDisplayedRange(year: number, index: number): boolean {
        const date = new Date(year, 0);
        // Проверяем второй элемент массива на null. Если задан null в опции displayedRanges
        // то лента будет отображаться бесконечно.
        return (
            this._displayedRanges[index][0] <= date &&
            (this._displayedRanges[index][1] === null ||
                this._displayedRanges[index][1] >= date)
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
                    return this._displayedRanges[
                        index + delta
                    ][0].getFullYear();
                } else {
                    return this._displayedRanges[
                        index + delta
                    ][1].getFullYear();
                }
            }
        }
        return year;
    }

    protected _changeYear(event: Event, delta: number): void {
        const year = this._position.getFullYear();
        let newYear;
        if (this._options.displayedRanges) {
            const amountOfFollowingItems =
                this._getAmountOfFollowingItems(delta);
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

    private _canChangeYear(
        year: number,
        delta: number,
        amountOfFollowingItems: number
    ): boolean {
        let changedYear = year;
        const yearsNotEqual = () => {
            return (
                changedYear !== this._getNextDisplayedYear(changedYear, delta)
            );
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
            if (
                !this._options.chooseHalfyears &&
                this._options.chooseQuarters
            ) {
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
                const amountOfFollowingItems = this._getAmountOfFollowingItems(
                    buttons[i].delta
                );
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
        this._notify('close', [], { bubbling: true });
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
        if (year <= this._position.getFullYear() || this._tabPressed) {
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
            return (
                'controls-PeriodLiteDialog__vLayout' +
                ' controls-PeriodLiteDialog__month-list'
            );
        }
        if (this._options.chooseQuarters) {
            return (
                'controls-PeriodLiteDialog__vLayout' +
                ' controls-PeriodLiteDialog__quarter-list'
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
        return new Date().getFullYear() === year;
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
            dateUtils.isDatesEqual(this._options.startValue, startValue) &&
            dateUtils.isDatesEqual(this._options.endValue, endValue)
        );
    }

    private _getPosition(options: IDateLitePopupOptions): Date {
        const position =
            options.year || options.startValue || new options.dateConstructor();
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
            if (
                displayedRange[1] &&
                displayedRange[1].getFullYear() === position.getFullYear()
            ) {
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
        const currentDate = new options.dateConstructor();
        const startValueYear = start ? start.getFullYear() : null;
        // максимально допустимая разница между текущим и отображаемым годом
        const maxYearsOffset = 6;

        if (!startValueYear) {
            return currentDate;
        }

        if (startValueYear >= currentDate.getFullYear()) {
            return start;
        } else if (
            currentDate.getFullYear() - startValueYear >=
            maxYearsOffset
        ) {
            return new options.dateConstructor(
                startValueYear + maxYearsOffset - 1,
                0
            );
        } else {
            return currentDate;
        }
    }

    private getWindowInnerWidth(): number {
        return window?.innerWidth;
    }

    static getDefaultOptions(): IDateLitePopupOptions {
        const PeriodDialogOptions: IDateLitePopupOptions =
            IPeriodSimpleDialog.getDefaultOptions();
        PeriodDialogOptions.captionFormatter =
            dateControlsUtils.formatDateRangeCaption;
        PeriodDialogOptions.itemTemplate = ItemWrapper;
        PeriodDialogOptions.monthTemplate = monthTmpl;
        PeriodDialogOptions.dateConstructor = WSDate;
        PeriodDialogOptions.arrowVisible = true;
        return PeriodDialogOptions;
    }

    static getOptionTypes(): IDateLitePopupOptions {
        const PeriodDialogTypes: IDateLitePopupOptions =
            IPeriodSimpleDialog.getOptionTypes();
        PeriodDialogTypes.captionFormatter = descriptor(Function);
        return PeriodDialogTypes;
    }
}

View.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

export default View;
