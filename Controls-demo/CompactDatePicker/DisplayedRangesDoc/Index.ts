import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/CompactDatePicker/DisplayedRangesDoc/DisplayedRanges');
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue: Date = new Date(2022, 0, 1);
    protected _endValue: Date = new Date(2022, 0, 30);
    protected _displayedRanges: Date[][] = [[new Date(2020, 0), new Date(2020, 11)]];
    protected _date: Date = new Date(2022, 2, 1);
}
