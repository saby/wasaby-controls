/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { Base as dateUtils } from 'Controls/dateUtils';

export function isRangeEnabled(
    date: Date,
    dateComparisonFunction: Function,
    dayAvailableCallback: Function
): boolean {
    let verifiableDay = date;
    let result = true;
    while (dateComparisonFunction(date, verifiableDay)) {
        result = dayAvailableCallback(verifiableDay);
        if (!result) {
            break;
        }
        verifiableDay = dateUtils.getTomorrow(verifiableDay);
    }

    return result;
}
