import { TQuantumType, TColumnDataDensity } from '../shared/types';
import { NAVIGATION_LIMIT_FACTOR } from '../constants';
import { getColumnGapSize } from '../utils';
import { TOffsetSize } from 'Controls/interface';
import { THoverMode } from '../interfaces/IDynamicGridComponent';

export const CLASS_DYNAMIC_HEADER_CELL = 'ControlsLists-dynamicGrid__dynamicHeaderCell';

export function getHeaderCellUniqueClass(data: number | Date): string {
    if (data instanceof Date) {
        const h = data.getHours();
        const d = data.getDate();
        const m = data.getMonth();
        const y = data.getFullYear();

        return `js-${CLASS_DYNAMIC_HEADER_CELL}_${d}-${m}-${y}_${h}-00`;
    }
    return `js-${CLASS_DYNAMIC_HEADER_CELL}_${data}`;
}

function getHeaderCellHoverClass(
    date: Date,
    itemsSpacing: TOffsetSize,
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity
): string {
    if (quantum !== 'day' || dataDensity === 'advanced') {
        return null;
    }

    const day = date.getDay();
    const SUNDAY = 0;
    const DAYS_IN_WEEK = 7;

    const daysToStart = (day === SUNDAY ? DAYS_IN_WEEK : day) - 1;

    return `ControlsLists-timelineGrid__headerCellHoverWeek ControlsLists-timelineGrid__headerCellHoverWeek_day-${daysToStart}_${itemsSpacing}`;
}

export function getDynamicHeaderCellClass(
    date: Date,
    itemsSpacing: TOffsetSize,
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity,
    hoverMode: THoverMode
): string {
    let className = `${CLASS_DYNAMIC_HEADER_CELL} js-${CLASS_DYNAMIC_HEADER_CELL} ${getHeaderCellUniqueClass(
        date
    )} ${CLASS_DYNAMIC_HEADER_CELL}_${hoverMode}`;
    const headerHoverClass = getHeaderCellHoverClass(date, itemsSpacing, quantum, dataDensity);
    if (headerHoverClass) {
        className += ` ${headerHoverClass}`;
    }
    return className;
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
    const gapSize = getColumnGapSize(columnsSpacing);
    return columnWidth * visibleColumnsCount + gapSize * visibleColumnsCount;
}
