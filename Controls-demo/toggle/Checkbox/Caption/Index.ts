import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/Checkbox/Caption/Template');

class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value1: boolean = true;
    protected _value2: boolean = true;
    protected _value3: boolean = true;
}

export default Direction;
