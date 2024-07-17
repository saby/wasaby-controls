import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/CompactDatePicker/SelectionType/Index';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default class SizeCompactDatePicker extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2022, 0, 1);
    protected _endValue: Date = new Date(2022, 0, 3);
    protected _date: Date = new Date(2012, 2, 1);
    protected _ranges: object = { days: [3, 7] };
}
