import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Range/TooltipFormatter/Template');

class TooltipFormatter extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _startValue: number;
    protected _endValue: number;
    protected _tooltipFormatter = (value: number): string => {
        return '$' + value;
    };

    protected _beforeMount(): void {
        this._startValue = 40;
        this._endValue = 60;
    }
}

export default TooltipFormatter;
