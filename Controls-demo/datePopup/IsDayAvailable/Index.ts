import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/datePopup/IsDayAvailable/Index';
import { Base } from 'Controls/dateUtils';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2020, 6);
    protected _endValue: Date = new Date(2020, 6, 10);

    protected _isDayAvailable(date: Date): boolean {
        const startRange = new Date(2020, 5, 3);
        const endRange = new Date(2020, 11, 31);
        return Base.hitsDisplayedRanges(date, [[startRange, endRange]]);
    }
}
