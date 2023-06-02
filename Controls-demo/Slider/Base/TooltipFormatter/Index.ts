import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/TooltipFormatter/Template');

class TooltipFormatter extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: number;
    protected _tooltipFormatter = (value: number): string => {
        return '$' + value;
    };

    protected _beforeMount(): void {
        this._value = 30;
    }
}

export default TooltipFormatter;
