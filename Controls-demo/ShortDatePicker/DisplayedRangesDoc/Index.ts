import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/ShortDatePicker/DisplayedRangesDoc/DisplayedRanges');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _startValue: Date = new Date(2022, 0);
    protected _endValue: Date = new Date(2022, 11, 31);

    protected _displayedRanges: Date[][] = [
        [new Date(2021, 0), new Date(2023, 11)],
    ];

    static _styles: string[] = [
        'Controls-demo/ShortDatePicker/ShortDatePicker',
    ];
}

export default DemoControl;
