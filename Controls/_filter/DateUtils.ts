import { Date as EntityDate, DateTime as EntityDateTime } from 'Types/entity';
import IFilterItem from 'Controls/_filter/interface/IFilterDescriptionItem';
import { loadSync } from 'WasabyLoader/ModulesLoader';

/**
 * Модуль с утилитами для работы с фильтрацией по датам
 * @private
 */

/**
 * Получает массив двух дат. Первый: дата, актуальная заданное количество минут назад, второй: текущая дата.
 * @param {EntityDateTime} now
 * @param {number} direction
 */
function getLastTimePeriod(now: EntityDateTime, direction: number): [Date, Date] {
    return [
        new EntityDateTime(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes() - direction,
            direction ? now.getSeconds() : null
        ),
        now,
    ];
}

/**
 * Получает массив двух дат. Первый: дата, актуальная заданное количество часов назад, второй: текущая дата.
 * @param {EntityDateTime} now
 * @param {number} direction
 */
function getLastHourPeriod(now: EntityDateTime, direction: number): [Date, Date] {
    return [
        new EntityDateTime(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours() - direction
        ),
        now,
    ];
}

/**
 * Получает массив двух дат. Первый: дата, актуальная заданное количество дней назад, второй: текущая дата.
 * @param {Date} today
 * @param {number} direction
 */
function getLastPeriod(today: Date, direction: number): [Date, Date] {
    return [
        new EntityDate(today.getFullYear(), today.getMonth(), today.getDate() - direction),
        today,
    ];
}

/**
 * Получает массив двух дат. Первый: дата, актуальная заданное количество месяцев назад, второй: текущая дата.
 * @param {number} monthCount
 * @param {unknown} _date
 */
function getLastPeriodRange(monthCount: number, _date): [Date, Date] {
    const date = _date ? new Date(_date) : new Date();
    date.setMonth(date.getMonth() - monthCount);
    return [date, _date || new Date()];
}

const yesterday = 1;
const weekDays = 7;
const month = 1;
const quarter = 3;
const year = 12;

const minute = 1;
const minute5 = 5;
const minute30 = 30;

/**
 * Получает временные периоды по значению элемента фильтра
 * @param {IFilterItem} filterItem
 */
export function getDates(filterItem: IFilterItem): [Date, Date] | null {
    const DateBaseUtils = loadSync('Controls/dateUtils').Base;
    const _date = filterItem.editorOptions?._date;
    const nowTime = _date || new EntityDateTime();
    const today = _date || new EntityDate();
    const periodType = filterItem.editorOptions?.periodType || 'current';
    const isUserPeriod = filterItem.editorOptions?.userPeriods?.find(
        (userPeriod) => filterItem.value === userPeriod.key
    );
    if (isUserPeriod) {
        if (isUserPeriod.getValueFunctionName) {
            return loadSync(isUserPeriod.getValueFunctionName)();
        } else {
            return undefined;
        }
    }
    switch (filterItem.value) {
        case 'minute':
            return periodType === 'last'
                ? getLastTimePeriod(nowTime, minute)
                : getLastTimePeriod(nowTime, 0);
        case '5minutes':
            return getLastTimePeriod(nowTime, minute5);
        case '30minutes':
            return getLastTimePeriod(nowTime, minute30);
        case 'hour':
            return periodType === 'last'
                ? getLastHourPeriod(nowTime, 1)
                : getLastHourPeriod(nowTime, 0);
        case 'today':
            return getLastPeriod(today, 0);
        case 'yesterday':
            return getLastPeriod(today, yesterday);
        case 'week':
            return periodType === 'last'
                ? getLastPeriod(today, weekDays)
                : [DateBaseUtils.getStartOfWeek(today), DateBaseUtils.getEndOfWeek(today)];
        case 'month':
            return periodType === 'last'
                ? getLastPeriodRange(month, _date)
                : [DateBaseUtils.getStartOfMonth(today), DateBaseUtils.getEndOfMonth(today)];
        case 'quarter':
            return periodType === 'last'
                ? getLastPeriodRange(quarter, _date)
                : [DateBaseUtils.getStartOfQuarter(today), DateBaseUtils.getEndOfQuarter(today)];
        case 'year':
            return periodType === 'last'
                ? getLastPeriodRange(year, _date)
                : [DateBaseUtils.getStartOfYear(today), DateBaseUtils.getEndOfYear(today)];
        default:
            return filterItem.value as [Date, Date];
    }
}
