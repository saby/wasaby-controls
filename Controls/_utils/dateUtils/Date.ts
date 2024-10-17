/**
 * @kaizen_zone 5855c118-3f74-451b-a4c3-5f37bdce5e9e
 */
/**
 * Утилиты для работы с датами.
 * @class Controls/_utils/dateUtils/Date
 * @public
 */

/**
 * На БЛ, минимальное значение для года - 1400.
 * Максимальное значение берем из формулы Текущий год + 1000.
 */
const additionalYears = 1000;
export const MIN_YEAR_VALUE = 1400;
export const MAX_YEAR_VALUE = new Date().getFullYear() + additionalYears;

/**
 * Проверяет валидность даты.
 * @param {Date} date
 * @returns {Boolean}
 */
export function isValidDate(date: Date): boolean {
    // If date is Invalid Date, "instanceof Date" will return true, so check getTime
    return (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date.getFullYear() >= MIN_YEAR_VALUE &&
        date.getFullYear() <= MAX_YEAR_VALUE
    );
}

/**
 * Проверяет равенство дат.
 * @param {Date} date1 первая дата.
 * @param {Date} date2 вторая дата.
 * @returns {boolean}
 */
export function isDatesEqual(date1: Date, date2: Date): boolean {
    return (
        date1 === date2 ||
        (date1 instanceof Date &&
            date2 instanceof Date &&
            (date1.getTime() === date2.getTime() ||
                (isNaN(date1.getTime()) && isNaN(date2.getTime()))))
    );
}

/**
 * Проверяет, одинаковый ли квартал в датах.
 * @param {Date} date1 первая дата.
 * @param {Date} date2 вторая дата.
 * @returns {boolean}
 */
export function isQuartersEqual(date1: Date, date2: Date): boolean {
    return (
        date1 === date2 ||
        (isValidDate(date1) &&
            isValidDate(date2) &&
            isDatesEqual(getStartOfQuarter(date1), getStartOfQuarter(date2)))
    );
}

/**
 * Проверяет, одинаковое ли полугодие в датах.
 * @param {Date} date1 первая дата.
 * @param {Date} date2 вторая дата.
 * @returns {boolean}
 */
export function isHalfYearsEqual(date1: Date, date2: Date): boolean {
    return (
        date1 === date2 ||
        (isValidDate(date1) &&
            isValidDate(date2) &&
            isDatesEqual(getStartOfHalfyear(date1), getStartOfHalfyear(date2)))
    );
}

/**
 * Проверяет, одинаковый ли год в датах.
 * @param {Date} date1 первая дата.
 * @param {Date} date2 вторая дата.
 * @returns {boolean}
 */
export function isYearsEqual(date1: Date, date2: Date): boolean {
    return (
        date1 === date2 ||
        (isValidDate(date1) && isValidDate(date2) && date1.getYear() === date2.getYear())
    );
}

/**
 * Проверяет, одинаковый ли месяц в датах.
 * @param {Date} date1 первая дата.
 * @param {Date} date2 вторая дата.
 * @returns {boolean}
 */
export function isMonthsEqual(date1: Date, date2: Date): boolean {
    return (
        date1 === date2 ||
        (isValidDate(date1) &&
            isValidDate(date2) &&
            date1.getYear() === date2.getYear() &&
            date1.getMonth() === date2.getMonth())
    );
}

/**
 * Проверяет, одинаковый ли день месяца в датах.
 * @param {Date} date1 первая дата.
 * @param {Date} date2 вторая дата.
 * @returns {boolean}
 */
export function isDaysEqual(date1: Date, date2: Date): boolean {
    return (
        date1 === date2 ||
        (isValidDate(date1) &&
            isValidDate(date2) &&
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate())
    );
}

/**
 * Возвращает следующий день.
 * @param {Date} date
 * @return {Date}
 */
export function getTomorrow(date: Date): Date {
    const result = new Date(normalizeDate(date));
    result.setDate(result.getDate() + 1);
    return result;
}

/**
 * Возвращает начало недели, в которой находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getStartOfWeek(date: Date): Date {
    const rDate = new date.constructor(date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    rDate.setDate(diff);
    return rDate;
}

/**
 * Возвращает конец недели, в которой находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getEndOfWeek(date: Date): Date {
    const rDate = new date.constructor(date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 0 : 7);
    rDate.setDate(diff);
    return rDate;
}

/**
 * Проверяет, является ли дата началом месяца
 * @param {Date} date
 * @return {Boolean}
 */
export function isStartOfMonth(date: Date): boolean {
    return this.isValidDate(date) && date.getDate() === 1;
}

/**
 * Проверяет, является ли дата концом месяца
 * @param {Date} date
 * @return {Boolean}
 */
export function isEndOfMonth(date: Date): boolean {
    if (!this.isValidDate(date)) {
        return false;
    }
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return this.isStartOfMonth(d);
}

/**
 * Возвращает начало месяца, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getStartOfMonth(date: Date): Date {
    const d: Date = date || new Date();
    return new d.constructor(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Возвращает конце месяца, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getEndOfMonth(date: Date): Date {
    const d: Date = date || new Date();
    return new d.constructor(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Возвращает количество дней в месяце.
 * @param {Date} date
 * @return {Number}
 */
export function getDaysInMonth(date: Date): number {
    return this.getEndOfMonth(date).getDate();
}

/**
 * Проверяет, является ли дата началом квартала.
 * @param {Date} date
 * @return {Boolean}
 */
export function isStartOfQuarter(date: Date): boolean {
    return this.isValidDate(date) && this.isStartOfMonth(date) && date.getMonth() % 3 === 0;
}

/**
 * Проверяет, является ли дата концом квартала.
 * @param {Date} date
 * @return {Boolean}
 */
export function isEndOfQuarter(date: Date): boolean {
    if (!this.isValidDate(date)) {
        return false;
    }
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return this.isStartOfQuarter(d);
}

/**
 * Возвращает начало квартала, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getStartOfQuarter(date: Date): Date {
    if (!date) {
        return false;
    }
    return new date.constructor(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
}

/**
 * Возвращает конец квартала, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getEndOfQuarter(date: Date): Date {
    if (!date) {
        return false;
    }
    return new date.constructor(date.getFullYear(), (Math.floor(date.getMonth() / 3) + 1) * 3, 0);
}

/**
 * Проверяет, является ли дата началом полугодия.
 * @param {Date} date
 * @return {Boolean}
 */
export function isStartOfHalfyear(date: Date): boolean {
    if (!date) {
        return false;
    }
    return this.isValidDate(date) && this.getStartOfMonth(date) && date.getMonth() % 6 === 0;
}

/**
 * Проверяет, является ли дата концом полугодия.
 * @param {Date} date
 * @return {Boolean}
 */
export function isEndOfHalfyear(date: Date): boolean {
    if (!date) {
        return false;
    }
    if (!this.isValidDate(date)) {
        return false;
    }
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return this.isStartOfHalfyear(d);
}

/**
 * Возвращает начало полугодия, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getStartOfHalfyear(date: Date): Date {
    return new date.constructor(date.getFullYear(), Math.floor(date.getMonth() / 6) * 6, 1);
}

/**
 * Возвращает конец полугодия, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getEndOfHalfyear(date: Date): Date {
    return new date.constructor(date.getFullYear(), (Math.floor(date.getMonth() / 6) + 1) * 6, 0);
}

/**
 * Проверяет, является ли дата началом года.
 * @param {Date} date
 * @return {Boolean}
 */
export function isStartOfYear(date: Date): boolean {
    return this.isValidDate(date) && date.getDate() === 1 && date.getMonth() === 0;
}

/**
 * Проверяет, является ли дата концом года.
 * @param {Date} date
 * @return {Boolean}
 */
export function isEndOfYear(date: Date): boolean {
    if (!this.isValidDate(date)) {
        return false;
    }
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return this.isStartOfYear(d);
}

/**
 * Возвращает начало года, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getStartOfYear(date: Date): Date {
    return new date.constructor(date.getFullYear(), 0, 1);
}

/**
 * Возвращает конец года, в котором находится дата.
 * @param {Date} date
 * @return {Date}
 */
export function getEndOfYear(date: Date): Date {
    return new date.constructor(date.getFullYear(), 12, 0);
}

/**
 * Возвращает дату, приведенную к началу месяца без определения времени.
 * @param month {Date}
 * @returns {Date}
 */
export function normalizeMonth(month: Date): Date {
    if (!(month instanceof Date)) {
        return null;
    }
    return new month.constructor(month.getFullYear(), month.getMonth(), 1);
}

/**
 * Возвращает дату, без определения времени.
 * @param date {Date}
 * @returns {Date}
 */
export function normalizeDate(date: Date): Date {
    if (date === null) {
        return null;
    }
    if (date) {
        return new date.constructor(date.getFullYear(), date.getMonth(), date.getDate());
    }
}

export function getDaysByRange(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

export function getHoursByRange(date1: Date, date2: Date): number {
    const oneHour = 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneHour));
}

export function isRangesOverlaps(
    startDate1: Date | number,
    endDate1: Date | number,
    startDate2: Date | number,
    endDate2: Date | number
): boolean {
    // Если значение null, то будем присваивать максимальную или минимальную дату.
    startDate1 = startDate1 !== null ? startDate1 : new Date(MIN_YEAR_VALUE, 0);
    endDate1 = endDate1 !== null ? endDate1 : new Date(MAX_YEAR_VALUE, 0);
    startDate2 = startDate2 !== null ? startDate2 : new Date(MIN_YEAR_VALUE, 0);
    endDate2 = endDate2 !== null ? endDate2 : new Date(MAX_YEAR_VALUE, 0);
    if (!startDate1 || !endDate1 || !startDate2 || !endDate2) {
        return false;
    }

    startDate1 = startDate1 instanceof Date ? startDate1.getTime() : startDate1;
    endDate1 = endDate1 instanceof Date ? endDate1.getTime() : endDate1;
    startDate2 = startDate2 instanceof Date ? startDate2.getTime() : startDate2;
    endDate2 = endDate2 instanceof Date ? endDate2.getTime() : endDate2;

    return Math.max(startDate1, startDate2) <= Math.min(endDate1, endDate2);
}

export function hitsDisplayedRanges(date: Date, displayedRanges: Date[][]): boolean {
    if (!displayedRanges || (displayedRanges[0][0] === null && displayedRanges[0][1] === null)) {
        return true;
    }
    if (displayedRanges) {
        for (const range of displayedRanges) {
            if (range[0] <= date && (date <= range[1] || range[1] === null)) {
                return true;
            }
        }
    }
    return false;
}
