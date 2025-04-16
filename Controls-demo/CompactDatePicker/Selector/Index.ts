import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/CompactDatePicker/Selector/Selector');

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue: Date = new Date(2018, 0, 1);
    protected _endValue: Date = new Date(2018, 0, 30);
    protected _date: Date = new Date(2018, 2, 1);
}
