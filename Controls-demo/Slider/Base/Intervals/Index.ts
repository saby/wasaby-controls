import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/Intervals/Template');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _intervals: unknown;
    protected _value1: number = 30;
    protected _value2: number = 30;

    protected _beforeMount(): void {
        this._intervals = [
            {
                start: 0,
                end: 10,
                color: 'primary',
            },
            {
                start: 30,
                end: 70,
                color: 'danger',
            },
        ];
    }
}

export default Base;
