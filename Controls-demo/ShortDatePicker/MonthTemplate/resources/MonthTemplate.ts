import * as template from 'wml!Controls-demo/ShortDatePicker/MonthTemplate/resources/MonthTemplate';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { date as formatDate } from 'Types/formatter';

export default class MonthTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _formatDate: Function = formatDate;

    protected _isQuarter(): boolean {
        if ([2, 5, 8, 11].includes(this._options.month.date)) {
            return true;
        }
        return false;
    }

    protected _getText(): string {
        let res = this._formatDate(this._options.month.date, this._formatDate.FULL_MONTH);
        if (this._isQuarter()) {
            res += ' 1 kj[';
        }
        return res;
    }
}
