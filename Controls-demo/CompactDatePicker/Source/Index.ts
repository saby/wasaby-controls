import Source from 'Controls-demo/CompactDatePicker/Source/resources/source';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';
import controlTemplate = require('wml!Controls-demo/CompactDatePicker/Source/Source');

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue: Date = new Date(2018, 0, 1);
    protected _endValue: Date = new Date(2018, 0, 30);
    protected _date: Date = new Date(2018, 2, 1);
    protected _source: Source = new Source();
}
