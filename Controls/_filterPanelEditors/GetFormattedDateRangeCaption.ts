import { period as dateRangeFormatter } from 'Types/formatter';

export default function formatDateRangeCaption(
    startValue?: Date,
    endValue?: Date,
    emptyCaption?: string,
    _currentDate?: Date,
    showCurrentYear?: boolean
): string {
    if (!startValue && !endValue) {
        return emptyCaption || '';
    }

    return dateRangeFormatter(startValue, endValue, {
        hiddenYearIfCurrentYear: !showCurrentYear,
        currentDate: _currentDate,
    });
}
