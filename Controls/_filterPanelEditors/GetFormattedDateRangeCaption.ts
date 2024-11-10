import { period as dateRangeFormatter, PeriodConfigurationType } from 'Types/formatter';

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
    const currentYear = (_currentDate || new Date()).getFullYear();
    const configuration =
        (startValue || endValue)?.getFullYear() === currentYear && !showCurrentYear
            ? PeriodConfigurationType.WithoutYear
            : PeriodConfigurationType.Default;
    return dateRangeFormatter(startValue, endValue, {
        configuration,
    });
}
