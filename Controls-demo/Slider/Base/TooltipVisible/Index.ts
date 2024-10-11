import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/TooltipVisible/Template');

class TooltipVisible extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: number;
    protected _value2: number;

    protected _beforeMount(): void {
        this._value = 30;
        this._value2 = 77;
    }
}

export default TooltipVisible;
