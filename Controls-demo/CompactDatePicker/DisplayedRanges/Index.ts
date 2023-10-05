import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/CompactDatePicker/DisplayedRanges/DisplayedRanges');
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue1: Date = new Date(2018, 0, 1);
    protected _endValue1: Date = new Date(2018, 0, 30);
    protected _startValue2: Date = new Date(2018, 0, 1);
    protected _endValue2: Date = new Date(2018, 0, 30);
    protected _displayedRanges1: Date[][] = [
        [new Date(2017, 0), new Date(2018, 3)],
        [new Date(2018, 5), new Date(2019, 7)],
    ];
    protected _displayedRanges2: Date[][] = [
        [new Date(2018, 0), new Date(2018, 5)],
        [new Date(2019, 5), new Date(2019, 7)],
    ];
    protected _date: Date = new Date(2018, 2, 1);
}
