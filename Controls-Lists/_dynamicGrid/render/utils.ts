import { GAP_SIZES_MAP, NAVIGATION_LIMIT_FACTOR } from '../constants';
import { TOffsetSize } from 'Controls/interface';

export const CLASS_DYNAMIC_HEADER_CELL = 'ControlsLists-dynamicGrid__dynamicHeaderCell';

export type TColumnDataDensity = 'empty' | 'default' | 'advanced';

export function getHeaderCellUniqueClass(date: Date): string {
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();

    return `js-${CLASS_DYNAMIC_HEADER_CELL}_${d}-${m}-${y}`;
}

function getHeaderCellHoverClass(
    date: Date,
    itemsSpacing: TOffsetSize,
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity,
): string {
    if (quantum !== 'day' || dataDensity === 'advanced') {
        return null;
    }

    const day = date.getDay();
    const SUNDAY = 0;
    const DAYS_IN_WEEK = 7;

    const daysToStart = (day === SUNDAY ? DAYS_IN_WEEK : day) - 1;

    return `ControlsLists-timelineGrid__headerCellHover ControlsLists-timelineGrid__headerCellHover_day-${daysToStart}_${itemsSpacing}`;
}

export function getDynamicHeaderCellClass(
    date: Date,
    itemsSpacing: TOffsetSize,
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity,
): string {
    let className = `${CLASS_DYNAMIC_HEADER_CELL} js-${CLASS_DYNAMIC_HEADER_CELL} ${getHeaderCellUniqueClass(date)}`;
    const headerHoverClass = getHeaderCellHoverClass(date, itemsSpacing, quantum, dataDensity);
    if (headerHoverClass) {
        className += ` ${headerHoverClass}`;
    }
    return className;
}

//TODO: отнести к timelineGrid.
export type TQuantumType = 'hour' | 'day' | 'month';
export type TPositionInPeriod = {};

export function datesEqualByQuantum(date1: Date, date2: Date, quantum: TQuantumType) {
    const equalYear = date1.getFullYear() === date2.getFullYear();
    const equalMonth = date1.getMonth() === date2.getMonth();
    if (quantum === 'month') {
        return equalYear && equalMonth;
    }
    const equalDay = date1.getDate() === date2.getDate();
    if (quantum === 'day') {
        return equalYear && equalMonth && equalDay;
    }
    const equalHour = date1.getHours() === date2.getHours();
    if (quantum === 'hour') {
        return equalYear && equalMonth && equalDay && equalHour;
    }
}

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
    const gapSize = GAP_SIZES_MAP[columnsSpacing];
    return columnWidth * visibleColumnsCount + gapSize * (visibleColumnsCount + 1);
}
