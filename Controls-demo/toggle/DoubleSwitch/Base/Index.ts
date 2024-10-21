import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/DoubleSwitch/Base/Template');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: boolean = false;
}
export default Base;
