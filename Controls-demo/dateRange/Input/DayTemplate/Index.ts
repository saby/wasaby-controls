import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/dateRange/Input/DayTemplate/DayTemplate');

class Range extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startDate: Date = new Date(2017, 0, 1, 12, 15, 30, 123);
    protected _endDate: Date = new Date(2017, 0, 2, 12, 15, 30, 123);
    protected _mask: string = 'DD.MM.YYYY';
}

export default Range;
