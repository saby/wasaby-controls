import { Base as BaseDateUtils, Range as RangeUtils } from 'Controls/dateUtils';
import { TNavigationDirection } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import {
    END_DAY_HOUR,
    START_DAY_HOUR,
    HOUR_QUANTUM_PAGE_SIZE,
    DAYS_COUNT_LIMIT,
    HOURS_COUNT,
} from 'Controls-Lists/_timelineGrid/constants';

export enum Quantum {
    Hour = 'hour',
    Day = 'day',
    Month = 'month',
}

export function getQuantum(range: IRange): Quantum {
    const hoursCount = BaseDateUtils.getHoursByRange(range.start, range.end);
    // Должно быть строгое сравнение, т.к. если выбрать 2 дня, то будет 24 часа, но квант должен быть день.
    // 24 часа, т.к. в датах время 00:00 всегда.
    if (hoursCount < HOURS_COUNT) {
        return Quantum.Hour;
    }

    const rangeSize = BaseDateUtils.getDaysByRange(range.start, range.end);
    if (rangeSize <= DAYS_COUNT_LIMIT) {
        return Quantum.Day;
    }

    return Quantum.Month;
}

/**
 * Возвращает размер диапазона.
 * В зависимости от кванта меняется единица измерения размера диапазона.
 * @param range
 * @param quantum
 */
export function getRangeSize(range: IRange, quantum: Quantum): number {
    switch (quantum) {
        case Quantum.Hour:
            return HOUR_QUANTUM_PAGE_SIZE;
        case Quantum.Day:
            return RangeUtils.getPeriodLengthInDays(range.start, range.end);
        case Quantum.Month:
            return RangeUtils.getPeriodLengthInMonths(range.start, range.end);
    }
}

export function getEventsSaturation(range: IRange): string {
    const quantum = getQuantum(range);
    const rangeSize = getRangeSize(range, quantum);
    return quantum === 'hour' || (quantum === 'day' && rangeSize <= 14)
        ? 'max'
        : quantum === 'day'
        ? 'mid'
        : 'min';
}

export function shiftDate(
    date: Date,
    direction: Exclude<TNavigationDirection, 'bothways'>,
    quantum: Quantum,
    shiftFactor: number = 1
): void {
    const shiftSize = (direction === 'backward' ? -1 : 1) * shiftFactor;
    switch (quantum) {
        case Quantum.Hour:
            if (date.getHours() === START_DAY_HOUR && shiftSize < 0) {
                date.setDate(date.getDate() - 1);
                date.setHours(END_DAY_HOUR + 1);
            } else if (date.getHours() === END_DAY_HOUR && shiftSize > 0) {
                date.setDate(date.getDate() + 1);
                date.setHours(START_DAY_HOUR - 1);
            }

            date.setHours(date.getHours() + shiftSize);

            // Если сместили на 12 часов с начала дня, то нужно сдвинуться на начало следующего дня
            if (date.getHours() === END_DAY_HOUR + 1) {
                date.setDate(date.getDate() + 1);
                date.setHours(START_DAY_HOUR);
            }

            if (date.getHours() < START_DAY_HOUR || date.getHours() > END_DAY_HOUR) {
                Logger.error('Wrong hours in date. Should be time 8:00-20:00.');
            }
            break;
        case Quantum.Day:
            date.setDate(date.getDate() + shiftSize);
            break;
        case Quantum.Month:
            date.setMonth(date.getMonth() + shiftSize);
            break;
    }
}
