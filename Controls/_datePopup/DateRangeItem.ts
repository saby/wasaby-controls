/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_datePopup/DateRangeItem';
import { MonthModel } from 'Controls/calendar';
import { isRangeEnabled } from 'Controls/_datePopup/Utils/RangeEnabled';
import { Base as dateUtils } from 'Controls/dateUtils';

export default class DateRangeItem extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _monthViewModel: MonthModel = MonthModel;

    private _isMonthEnabled(date: Date): boolean {
        if (!this._options.isDayAvailable) {
            return true;
        }

        return isRangeEnabled(
            date,
            dateUtils.isMonthsEqual,
            this._options.isDayAvailable
        );
    }

    protected _proxyEvent(event: Event): void {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    }

    protected _monthCaptionClick(event: Event, date: Date): void {
        if (this._isMonthEnabled(date)) {
            this._notify('monthCaptionClick', [date]);
        }
    }
}
