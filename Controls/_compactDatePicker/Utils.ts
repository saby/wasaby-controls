/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import { date as formatDate } from 'Types/formatter';

export function getFormattedCaption(date: Date, currentYear?: Date): string {
    const year = currentYear?.getFullYear() || new Date().getFullYear();
    if (date.getFullYear() !== year) {
        return formatDate(date, formatDate.FULL_MONTH);
    } else {
        return formatDate(date, 'MMMM');
    }
}
