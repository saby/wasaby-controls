/**
 * @kaizen_zone a6f7e3ef-ed43-410d-9cea-ff0ee79dcaee
 */
import { compare } from 'Types/entity';
import { Date as WSDate } from 'Types/entity';
import { isValidDateRange } from 'Controls/validate';
import { isDatesEqual } from 'Controls/_utils/dateUtils/Date';

/**
 * Утилиты для работы с периодами дат.
 * @class Controls/_utils/dateUtils/DateRangeUtil
 * @public
 */

export enum SHIFT_DIRECTION {
    BACK = -1,
    FORWARD = 1,
}

export function getRangeValueValidators(
    validators?: Function[] | object[],
    rangeModel,
    value
): Function[] {
    return [
        isValidDateRange.bind(null, {
            startValue: rangeModel.startValue,
            endValue: rangeModel.endValue,
        }),
        ...validators.map((validator) => {
            let _validator: Function;
            let args: object;
            if (typeof validator === 'function') {
                _validator = validator;
            } else {
                _validator = validator.validator;
                args = validator.arguments;
            }
            return _validator.bind(null, {
                ...(args || {}),
                value,
                startValue: rangeModel.startValue,
                endValue: rangeModel.endValue
            });
        }),
    ];
}

export const dateMaskConstants = {
    DD_MM_YYYY: 'DD.MM.YYYY',
    DD_MM_YY: 'DD.MM.YY',
    MM_YYYY: 'MM.YYYY',
};

/**
 * Смещает период к смежному
 * @remark
 * Если период кратен месяцу, сдвиг просиходит на соответствующее количество месяцев.
 * Если период кратен дню, сдвиг происходит на соответствующее количество дней.
 * @example
 * const startValue = new Date(2022, 0, 4);
 * const endValue = new Date(2022, 0, 7);
 * const direction = 1;
 * // Вернет [new Date(2022, 0, 8), new Date(2022, 0, 11)
 * shiftPeriod(startValue, endValue, direction);
 * @param {Date} startValue Начало периода.
 * @param {Date} endValue Конец периода.
 * @param {Number} direction Дельта сдвига периода. Отрицательное значение приведет к сдвигу на предыдушие даты.
 * @param {Controls/_dateRange/interfaces/IRangeSelectable/SelectionType.typedef} selectionType Режим выделения диапазона
 * @returns {[Date, Date]}
 */
export function shiftPeriod(
    startValue: Date,
    endValue: Date,
    direction: number,
    selectionType?: string
): [Date, Date] {
    let result;
    if (compare.isFullInterval(startValue, endValue, compare.DateUnits.Month)) {
        result = shiftPeriodByMonth(
            startValue,
            endValue,
            direction * getPeriodLengthInMonths(startValue, endValue)
        );
    } else {
        let periodLengthInDays;
        if (selectionType === 'workdays') {
            periodLengthInDays = 7;
        } else {
            periodLengthInDays = getPeriodLengthInDays(startValue, endValue);
        }
        result = shiftPeriodByDays(startValue, endValue, direction * periodLengthInDays);
    }
    return result;
}

/**
 * Сдвигает период на несколько месяцев.
 * @param {Date} startValue Начало периода
 * @param {Date} endValue Конец периода
 * @param {Number} direction Дельта сдвига периода. Отрицательное значение приведет к сдвигу на предыдушие даты.
 * @returns {[Date, Date]}
 */
export function shiftPeriodByMonth(
    startValue: Date,
    endValue: Date,
    direction: number
): [Date, Date] {
    return [
        new WSDate(startValue.getFullYear(), startValue.getMonth() + direction, 1),
        new WSDate(endValue.getFullYear(), endValue.getMonth() + direction + 1, 0),
    ];
}

/**
 * Сдвигает период на несколько дней.
 * @param {Date} startValue Начало периода
 * @param {Date} endValue Конец периода
 * @param {Number} direction Дельта сдвига периода. Отрицательное значение приведет к сдвигу на предыдушие даты.
 * @returns {[Date, Date]}
 */
export function shiftPeriodByDays(
    startValue: Date,
    endValue: Date,
    direction: number
): [Date, Date] {
    return [
        new WSDate(
            startValue.getFullYear(),
            startValue.getMonth(),
            startValue.getDate() + direction
        ),
        new WSDate(endValue.getFullYear(), endValue.getMonth(), endValue.getDate() + direction),
    ];
}

/**
 * Вовращает длину периода в месяцах.
 * @param {Date} startValue Начало периода
 * @param {Date} endValue Конец периода
 * @returns {Number}
 */
export function getPeriodLengthInMonths(startValue: Date, endValue: Date): number {
    return (
        (endValue.getFullYear() - startValue.getFullYear()) * 12 +
        (endValue.getMonth() - startValue.getMonth() + 1)
    );
}

/**
 * Возвращает длину периода в днях.
 * @param {Date} startValue Начало периода
 * @param {Date} endValue Конец периода
 */
export function getPeriodLengthInDays(startValue: Date, endValue: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.ceil(Math.abs((startValue.getTime() - endValue.getTime()) / oneDay)) + 1;
}

export function getResetButtonVisible(
    startValue: Date,
    endValue: Date,
    resetStartValue: Date,
    resetEndValue: Date
): boolean {
    const setTimeToZero = (date: Date): Date => {
        if (date instanceof Date) {
            const newDate = new Date(date);
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
            return newDate;
        }
        return date;
    };
    const values = {startValue, endValue, resetStartValue, resetEndValue};
    for (const index in values) {
        if (values.hasOwnProperty(index)) {
            values[index] = setTimeToZero(values[index]);
        }
    }
    const hasResetStartValue = values.resetStartValue || values.resetStartValue === null;
    const hasResetEndValue = values.resetEndValue || values.resetEndValue === null;

    return (
        (hasResetStartValue && !isDatesEqual(values.startValue, values.resetStartValue)) ||
        (hasResetEndValue && !isDatesEqual(values.endValue, values.resetEndValue))
    );
}
