import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/BorderVisible/Template');

class BorderVisible extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: number;

    protected _beforeMount(): void {
        this._value = 30;
    }
}

export default BorderVisible;
