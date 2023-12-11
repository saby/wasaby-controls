import { TColumnKey, TQuantumType } from '../shared/types';
import { NAVIGATION_LIMIT_FACTOR } from '../constants';
import { getColumnGapSize } from '../utils';
import { TOffsetSize } from 'Controls/interface';
import { date as formatter } from 'Types/formatter';

export function getPositionInPeriod(date: Date, quantum: TQuantumType): number {
    if (quantum === 'day') {
        return calculateDayFraction(date);
    } else if (quantum === 'month') {
        return calculateMonthFraction(date);
    } else if (quantum === 'hour') {
        return calculateHourFraction(date);
    }
}

function calculateDayFraction(date: Date): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const totalMins = hours * 60 + minutes;
    const dayMins = 24 * 60;

    return totalMins / dayMins;
}

function calculateMonthFraction(date: Date): number {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const dayOfMonth = date.getDate();
    return dayOfMonth / daysInMonth;
}

function calculateHourFraction(date: Date): number {
    const minutesInHour = 60;
    const minute = date.getMinutes();
    return minute / minutesInHour;
}

export function getInitialColumnsScrollPosition(
    columnWidth: number,
    columnsCount: number,
    columnsSpacing: TOffsetSize
): number {
    const visibleColumnsCount = Math.trunc(columnsCount / NAVIGATION_LIMIT_FACTOR);
    const gapSize = getColumnGapSize(columnsSpacing);
    return columnWidth * visibleColumnsCount + gapSize * visibleColumnsCount;
}

export function getDataQa(element: string, data: Date | TColumnKey) {
    const dataString = data instanceof Date ? formatter(data, 'YYYY-MM-DD HH:mm') : '' + data;
    return element + '_' + dataString;
}
