export const CLASS_DYNAMIC_HEADER_CELL = 'ControlsLists-dynamicGrid__dynamicHeaderCell';

export function getDynamicHeaderCellClass(date: Date): string {
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();

    return `${CLASS_DYNAMIC_HEADER_CELL} js-${CLASS_DYNAMIC_HEADER_CELL} js-${CLASS_DYNAMIC_HEADER_CELL}_${d}-${m}-${y}`;
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
