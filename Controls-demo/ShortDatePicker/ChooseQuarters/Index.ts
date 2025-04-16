import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/ShortDatePicker/ChooseQuarters/Template');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2022, 0);
    protected _endValue: Date = new Date(2022, 11, 31);

    static _styles: string[] = ['Controls-demo/ShortDatePicker/ShortDatePicker'];
}

export default DemoControl;
