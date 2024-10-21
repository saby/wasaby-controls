/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TQuantumType } from '../types';

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
    const equalMinutes = date1.getMinutes() === date2.getMinutes();
    if (quantum === 'minute') {
        return equalYear && equalMonth && equalDay && equalHour && equalMinutes;
    }
    const equalSecond = date1.getSeconds() === date2.getSeconds();
    if (quantum === 'second') {
        return equalYear && equalMonth && equalDay && equalHour && equalMinutes && equalSecond;
    }
}
