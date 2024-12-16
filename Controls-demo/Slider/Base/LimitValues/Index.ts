import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/LimitValues/Template');

export default class LimitedValue extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: number;
}
