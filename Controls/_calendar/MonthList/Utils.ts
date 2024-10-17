/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';

export default {
    dateToId(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    },
    idToDate(str: string, dateConstructor?: Function): Date {
        const d: string[] = this.getClearDateId(str).split('-');
        return new (dateConstructor || WSDate)(d[0], (parseInt(d[1], 10) || 1) - 1);
    },
    getClearDateId(dateId: string): string {
        return dateId.replace('h', '');
    },
};
