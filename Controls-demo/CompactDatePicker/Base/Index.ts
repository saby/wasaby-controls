import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/CompactDatePicker/Base/Index';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default class SizeCompactDatePicker extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2022, 1, 1);
    protected _endValue: Date = new Date(2022, 1, 28);
    protected _value: Date = new Date(2022, 0, 7);
}
