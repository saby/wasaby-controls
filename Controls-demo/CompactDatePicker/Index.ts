import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/CompactDatePicker/CompactDatePicker');
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startValue: Date = new Date(2018, 0, 1);
    protected _endValue: Date = new Date(2018, 0, 30);
    protected _date: Date = new Date(2018, 2, 1);

    protected _getClassForTheme(): string {
        const postfix = this._options.theme !== 'default' ? '_other-themes' : '';
        return 'controlsDemo-CompactDatePicker_height' + postfix;
    }
}
