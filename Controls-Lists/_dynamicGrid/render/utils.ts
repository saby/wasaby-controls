import { TColumnKey, TQuantumType } from '../shared/types';
import { NAVIGATION_LIMIT_FACTOR } from '../constants';
import { getColumnGapSize } from '../utils';
import { TOffsetSize } from 'Controls/interface';
import { date as formatter } from 'Types/formatter';

/**
 * Функция считает сдвиг относительно начала периода.
 * Используется, например, для позиционирования линии текущего периода.
 * @param date
 * @param quantum
 */
export function getPositionInPeriod(date: Date, quantum: TQuantumType): number {
    if (quantum === 'day') {
        return calculateDayFraction(date);
    } else if (quantum === 'month') {
        return calculateMonthFraction(date);
    } else if (quantum === 'hour') {
        return calculateHourFraction(date);
    }
}

/**
 * Возвращает дату, скорректированную до первого момента времени в текущем кванте.
 * Используется для определения точной границы времени в текущем периоде.
 * @param date
 * @param quantum
 */
export function getStartDate(date: Date, quantum: TQuantumType): Date {
    switch (quantum) {
        case 'hour':
            date.setMinutes(0, 0, 0);
            break;
        case 'day':
            date.setHours(0, 0, 0, 0);
            break;
        case 'month':
            // 1 - первый день этого месяца, а 0 - последний день предыдущего месяца
            date.setDate(1);
            date.setHours(0, 0, 0, 0);
            break;
    }
    return date;
}

/**
 * Возвращает дату, скорректированную до последнего момента времени в текущем кванте.
 * Используется для определения точной границы времени в текущем периоде.
 * @param date
 * @param quantum
 */
export function getEndDate(date: Date, quantum: TQuantumType): Date {
    switch (quantum) {
        case 'hour':
            date.setMinutes(59, 59, 999);
            break;
        case 'day':
            date.setHours(23, 59, 59, 999);
            break;
        case 'month':
            date.setMonth(date.getMonth() + 1);
            date.setDate(0);
            date.setHours(23, 59, 59, 999);
            break;
    }
    return date;
}

/**
 * Возвращает долю прошедшего времени относительно дня.
 * @param date
 */
function calculateDayFraction(date: Date): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const totalMins = hours * 60 + minutes;
    const dayMins = 24 * 60;

    return totalMins / dayMins;
}

/**
 * Возвращает долю прошедшего времени относительно месяца.
 * @param date
 */
function calculateMonthFraction(date: Date): number {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const dayOfMonth = date.getDate();
    return dayOfMonth / daysInMonth;
}

/**
 * Возвращает долю прошедшего времени относительно часа.
 * @param date
 */
function calculateHourFraction(date: Date): number {
    const minutesInHour = 60;
    const minute = date.getMinutes();
    return minute / minutesInHour;
}

/**
 * Рассчитывает значение скролла для позиционирования при построении.
 * Позиционирование осуществляется проскролом по горизонтали 1/3 динамических колонок.
 * @param columnWidth
 * @param columnsCount
 * @param columnsSpacing
 */
export function getInitialColumnsScrollPosition(
    columnWidth: number,
    columnsCount: number,
    columnsSpacing: TOffsetSize
): number {
    const visibleColumnsCount = Math.trunc(columnsCount / NAVIGATION_LIMIT_FACTOR);
    const gapSize = getColumnGapSize(columnsSpacing);
    return columnWidth * visibleColumnsCount + gapSize * visibleColumnsCount;
}

/**
 * Формирует атрибут data-qa для динамической колонки.
 * @param element
 * @param data
 */
export function getDataQa(element: string, data: Date | TColumnKey) {
    const dataString = data instanceof Date ? formatter(data, 'YYYY-MM-DD HH:mm') : '' + data;
    return element + '_' + dataString;
}
