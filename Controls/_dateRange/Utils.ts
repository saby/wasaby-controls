/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
// @ts-ignore
import getFormattedDateRange = require('Core/helpers/Date/getFormattedDateRange');
// @ts-ignore
import locales = require('Core/helpers/i18n/locales');
import { Date as WSDate, DateTime, compare } from 'Types/entity';
import { Base as DateUtil } from 'Controls/dateUtils';

let localeCode = locales.current.code;
let weekdaysCaptions;

enum WEEKS_MODE {
    current = 'current',
    extended = 'extended',
}

const getDayRange = (
    startDate: Date,
    endDate: Date,
    quantum: number
): [Date, Date] => {
    const date = new WSDate(startDate);
    if (startDate <= endDate) {
        date.setDate(date.getDate() + quantum - 1);
        return [startDate, date];
    } else {
        date.setDate(date.getDate() - quantum + 1);
        return [date, startDate];
    }
};

const AMOUNT_OF_MONTHS_IN_QUARTER = 3;
const AMOUNT_OF_MONTHS_IN_HALFYEAR = 6;

const QUARTERS = [
    {
        startMonth: 0,
        endMonth: 2,
    },
    {
        startMonth: 3,
        endMonth: 5,
    },
    {
        startMonth: 6,
        endMonth: 8,
    },
    {
        startMonth: 9,
        endMonth: 11,
    },
];

const HALFYEARS = [
    {
        startMonth: 0,
        endMonth: 5,
    },
    {
        startMonth: 6,
        endMonth: 11,
    },
];

enum QUANTS {
    MONTH = 'month',
    YEAR = 'year',
    DATE = 'date',
    HALFYEAR = 'halfyear',
    QUARTER = 'quarter',
    DATE_RANGE = 'dateRange',
    MONTHS_RANGE = 'monthsRange',
    YEARS_RANGE = 'yearsRange',
}

/**
 * @class Controls/_dateRange/Utils
 * @public
 */
const Utils = {
    /**
     * Возвращает список названий дней недели.
     * @function Controls/_dateRange/Utils#getWeekdaysCaptions
     * @returns {Array}
     */

    /*
     * Returns the list of days of the week
     * @returns {Array}
     */
    getWeekdaysCaptions() {
        if (!weekdaysCaptions || localeCode !== locales.current.code) {
            localeCode = locales.current.code;
            const daysSmall = locales.current.config.daysSmall;
            const days = daysSmall.slice(1);
            days.push(daysSmall[0]);

            weekdaysCaptions = days.map((value, index) => {
                return {
                    caption: value,
                    weekend: index === 5 || index === 6,
                    day: index,
                };
            });
        }
        return weekdaysCaptions;
    },

    /**
     * Возвращает форматированный период дат для заголовка контрола периода дат.
     * @function Controls/_dateRange/Utils#formatDateRangeCaption
     * @param {Number} startValue
     * @param {Number} endValue
     * @param {String} emptyCaption
     * @returns {*}
     */

    /*
     * Returns formatted date range for date range controls caption.
     * @param startValue
     * @param endValue
     * @param emptyCaption
     * @returns {*}
     */
    formatDateRangeCaption(
        startValue: Date,
        endValue: Date,
        emptyCaption?: string
    ): string {
        if (!startValue && !endValue && !emptyCaption) {
            return '';
        }
        // As an empty value, use the non-breaking space @nbsp; ('\ xA0') that would not make layout
        return getFormattedDateRange(startValue, endValue, {
            contractToMonth: true,
            fullNameOfMonth: true,
            contractToQuarter: true,
            contractToHalfYear: true,
            emptyPeriodTitle: emptyCaption || '\xA0',
        });
    },

    /**
     * Получить смещение первого дня месяца (количество дней перед первым числом).
     * @param {Number} year год
     * @param {Number} month месяц
     * @returns {Number}
     */
    getFirstDayOffset(year: number, month: number): number {
        const date = new WSDate(year, month ? month - 1 : 0);
        const day = date.getDay();

        return day ? day - 1 : 6; // Воскресенье 0-й день
    },

    /**
     * Получить количество дней в месяце.
     * @param {Number} year год
     * @param {Number} month месяц
     * @returns {Number}
     */
    getDaysInMonth(year: number, month: number): number {
        return new WSDate(year, month, 0).getDate();
    },

    /**
     * Получить количство всех недель в месяце.
     * @param {Number} year
     * @param {Number} month
     * @returns {Number}
     */
    getWeeksInMonth(year: number, month: number): number {
        const days = this.getDaysInMonth(year, month);
        const offset = this.getFirstDayOffset(year, month);

        return Math.ceil((days + offset) / 7);
    },

    /**
     * Получить массив недель (строка) с массивом дней (ячейка) для MonthTableBody.
     * @param {Date} date месяц
     * @param {String} mode
     * @variant current Возвращает текущий месяц.
     * @variant extended Возвращает массив из 6 недель. Возвращает первую неделю текущего месяца, последнюю полную неделю, и если текущий месяц включает менее 6 недель, то недели следующего месяца.
     * @returns {Array}
     */
    getWeeksArray(
        date: Date,
        mode: WEEKS_MODE,
        dateConstructor: Function = WSDate
    ): Date[][] {
        const weeksArray: [] = [];
        const year: number = date.getFullYear();
        const month: number = date.getMonth() + 1;
        const weeksInMonth: number =
            mode === WEEKS_MODE.extended
                ? 6
                : this.getWeeksInMonth(year, month);

        let monthDate: number = this.getFirstDayOffset(year, month) * -1 + 1;

        for (let w = 0; w < weeksInMonth; w++) {
            const daysArray: DateTime[] = [];

            for (let d = 0; d < 7; d++) {
                daysArray.push(new dateConstructor(year, month - 1, monthDate));
                monthDate++;
            }
            weeksArray.push(daysArray);
        }

        return weeksArray;
    },

    updateRangeByQuantum(
        baseDate: Date,
        date: Date,
        quantum: object
    ): [Date, Date] {
        let lastQuantumLength;
        let lastQuantumType;
        let days;
        let start;
        let end;
        let i;
        let date2;

        if ('days' in quantum) {
            lastQuantumType = 'days';
            for (i = 0; i < quantum.days.length; i++) {
                lastQuantumLength = quantum.days[i];
                days = DateUtil.getDaysByRange(baseDate, date) + 1;
                if (quantum.days[i] >= days) {
                    return getDayRange(baseDate, date, lastQuantumLength);
                }
            }
        }
        if ('weeks' in quantum) {
            lastQuantumType = 'weeks';
            for (i = 0; i < quantum.weeks.length; i++) {
                lastQuantumLength = quantum.weeks[i];
                if (baseDate <= date) {
                    start = DateUtil.getStartOfWeek(baseDate);
                    end = DateUtil.getEndOfWeek(baseDate);
                    end.setDate(end.getDate() + (lastQuantumLength - 1) * 7);
                } else {
                    start = DateUtil.getStartOfWeek(baseDate);
                    start.setDate(
                        start.getDate() - (lastQuantumLength - 1) * 7
                    );
                    end = DateUtil.getEndOfWeek(baseDate);
                }
                if (date >= start && date <= end) {
                    return [start, end];
                }
            }
        }
        if ('months' in quantum) {
            lastQuantumType = 'months';
            for (i = 0; i < quantum.months.length; i++) {
                lastQuantumLength = quantum.months[i];
                if (baseDate <= date) {
                    start = DateUtil.getStartOfMonth(baseDate);
                    const endValue = new WSDate(
                        baseDate.getFullYear(),
                        baseDate.getMonth() + (lastQuantumLength - 1)
                    );
                    end = DateUtil.getEndOfMonth(endValue);
                } else {
                    start = DateUtil.getStartOfMonth(baseDate);
                    start.setMonth(start.getMonth() - (lastQuantumLength - 1));
                    end = DateUtil.getEndOfMonth(baseDate);
                }
                if (date >= start && date <= end) {
                    return [start, end];
                }
            }
        }

        if (lastQuantumType === 'days') {
            return getDayRange(baseDate, date, lastQuantumLength);
        } else if (lastQuantumType === 'weeks') {
            date2 = new WSDate(baseDate);
            date2.setDate(date2.getDate() + (lastQuantumLength - 1) * 7);
            if (baseDate <= date) {
                return [
                    DateUtil.getStartOfWeek(baseDate),
                    DateUtil.getEndOfWeek(date2),
                ];
            } else {
                return [
                    DateUtil.getStartOfWeek(date2),
                    DateUtil.getEndOfWeek(baseDate),
                ];
            }
        } else if (lastQuantumType === 'months') {
            date2 = new WSDate(baseDate);
            date2.setMonth(date2.getMonth() + lastQuantumLength - 1);
            if (baseDate <= date) {
                return [
                    DateUtil.getStartOfMonth(baseDate),
                    DateUtil.getEndOfMonth(date2),
                ];
            } else {
                return [
                    DateUtil.getStartOfMonth(date2),
                    DateUtil.getEndOfMonth(baseDate),
                ];
            }
        }

        if (baseDate <= date) {
            return [baseDate, date];
        } else {
            return [date, baseDate];
        }
    },

    updateRangeByWorkdays(date: Date): Date[] {
        let weekDay = date.getDay();
        if (weekDay === 0) {
            // Нумирование начинается с воскресения, присвоем ему индекс последнего для удобства
            weekDay = 7;
        }
        const mondayIndex = 1;
        const fridayIndex = 5;
        // Понедельник
        const startValue = new WSDate(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - weekDay + mondayIndex
        );
        // Пятница
        const endValue = new WSDate(
            startValue.getFullYear(),
            startValue.getMonth(),
            startValue.getDate() + (fridayIndex - mondayIndex)
        );
        return [startValue, endValue];
    },

    /**
     * @typedef {String} TQuant
     * @description Тип кванта
     * @variant date - единичная дата
     * @variant dateRange - период дат
     * @variant month - еденичный месяц
     * @variant monthsRange - период месяцев
     * @variant year - единичный год
     * @variant yearsRange - период лет
     * @variant quarter - квартал
     * @variant halfyear - полугодие
     */

    /**
     * Получить квант выбранного периода
     * @remark
     * Используется для определения нужной ширины контрола выбора периода вместе с кнопками-стрелками переключающими
     * период в зависимости от выбранного кванта. Для решения данной задачи существует набор классов,
     * которые нужно навесить на родительский элемент контрола выбора периода и кнопок-стрелок:
     * * controls-DateRangeSelector__quant-month
     * * controls-DateRangeSelector__quant-year
     * * controls-DateRangeSelector__quant-date
     * * controls-DateRangeSelector__quant-halfyear
     * * controls-DateRangeSelector__quant-quarter
     * * controls-DateRangeSelector__quant-dateRange
     * * controls-DateRangeSelector__quant-monthsRange
     * * controls-DateRangeSelector__quant-yearsRange
     * @example
     * <pre>
     *    <Controls.date:ContextProvider attr:class="controls-DateRangeSelector__{{ _quant }}-width controlsDemo__flex">
     *       <div>
     *          <Controls.dateRange:SelectorConsumer
     *             attr:class="ws-flex-grow-1"
     *             bind:startValue="_startValue"
     *             bind:endValue="_endValue"
     *             on:rangeChanged="_rangeChangedHandler()"
     *          />
     *          <Controls.date:ArrowButtonConsumer direction="left"/>
     *          <Controls.date:ArrowButtonConsumer direction="right" attr:class="controls-margin_left-m"/>
     *       </div>
     *    </Controls.date:ContextProvider>
     * </pre>
     * <pre>
     *     import {Utils} from 'Controls/dateRange';
     *     ...
     *     protected _beforeMount(): void {
     *       this._quant = Utils.getQuantByRange(this._startValue, this._endValue);
     *     }
     *
     *     protected _rangeChangedHandler(event: Event, startValue: Date, endValue: Date): void {
     *       this._quant = Utils.getQuantByRange(startValue, endValue);
     *     }
     * </pre>
     * @param {Date} startValue
     * @param {Date} endValue
     * @returns {TQuant}
     * @demo Controls-demo/dateRange/DateRangeContextProvider/Index
     */
    getQuantByRange(startValue: Date, endValue: Date): string {
        if (DateUtil.isDatesEqual(startValue, endValue)) {
            return QUANTS.DATE;
        }
        if (
            compare.isFullInterval(startValue, endValue, compare.DateUnits.Year)
        ) {
            if (startValue.getFullYear() === endValue.getFullYear()) {
                return QUANTS.YEAR;
            } else {
                return QUANTS.YEARS_RANGE;
            }
        }
        if (
            compare.isFullInterval(
                startValue,
                endValue,
                compare.DateUnits.Month
            )
        ) {
            if (
                startValue.getMonth() === endValue.getMonth() &&
                startValue.getFullYear() === endValue.getFullYear()
            ) {
                return QUANTS.MONTH;
            }
            const startMonth = startValue.getMonth();
            const endMonth = endValue.getMonth();
            const hitsRange = (quants) => {
                for (const period of quants) {
                    if (
                        period.startMonth === startMonth &&
                        period.endMonth === endMonth
                    ) {
                        return true;
                    }
                }
            };
            if (endMonth - startMonth === AMOUNT_OF_MONTHS_IN_QUARTER - 1) {
                if (hitsRange(QUARTERS)) {
                    return QUANTS.QUARTER;
                }
            }
            if (endMonth - startMonth === AMOUNT_OF_MONTHS_IN_HALFYEAR - 1) {
                if (hitsRange(HALFYEARS)) {
                    return QUANTS.HALFYEAR;
                }
            }
            return QUANTS.MONTHS_RANGE;
        }

        return QUANTS.DATE_RANGE;
    },
};

export default Utils;
