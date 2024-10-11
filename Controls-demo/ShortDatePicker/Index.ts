import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/ShortDatePicker/ShortDatePicker');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _startValue: Date = new Date(2020, 0);
    protected _endValue: Date = new Date(2020, 11, 31);

    // Используется только в тестах
    protected _date: Date = new Date(2022, 0, 5);

    static _styles: string[] = ['Controls-demo/ShortDatePicker/ShortDatePicker'];
}

export default DemoControl;
