import { TNavigationDirection } from 'Controls/interface';
import { Quantum } from 'Controls-Lists/timelineGrid';

export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    const SATURDAY = 6;
    const SUNDAY = 0;
    return day === SATURDAY || day === SUNDAY;
}

export function shiftDate(date: Date, direction: TNavigationDirection, quantum: Quantum): void {
    const shiftSize = direction === 'backward' ? -1 : 1;
    switch (quantum) {
        case Quantum.Second:
        case Quantum.Minute:
        case Quantum.Hour:
            date.setHours(date.getHours() + shiftSize);
            break;
        case Quantum.Day:
            date.setDate(date.getDate() + shiftSize);
            break;
        case Quantum.Month:
            date.setMonth(date.getMonth() + shiftSize);
            break;
    }
}
