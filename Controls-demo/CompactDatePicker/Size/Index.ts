import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/CompactDatePicker/Size/Index';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default class SizeCompactDatePicker extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2018, 0, 1);
    protected _endValue: Date = new Date(2018, 0, 30);
    protected _date: Date = new Date(2018, 2, 1);
}
