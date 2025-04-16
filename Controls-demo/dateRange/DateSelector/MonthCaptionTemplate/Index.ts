import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/dateRange/DateSelector/MonthCaptionTemplate/Index');

export default class MonthCaptionTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value: Date = new Date(2018, 0, 1);
    protected _date: Date = new Date(2020, 0, 1);

    protected _getIconStyle(value: Date): string {
        return value.getMonth() % 2 === 0 ? 'success' : 'unaccented';
    }
}
