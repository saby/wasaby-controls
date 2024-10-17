import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/dateRange/RangeSelector/IsDayAvailable/Index');
import { Base } from 'Controls/dateUtils';

export default class RangeSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2020, 7, 1);
    protected _endValue: Date = new Date(2020, 7, 2);

    protected _isDayAvailable(date: Date): boolean {
        const startRange = new Date(2020, 5, 3);
        const endRange = new Date(2020, 11, 31);
        return Base.hitsDisplayedRanges(date, [[startRange, endRange]]);
    }
}
