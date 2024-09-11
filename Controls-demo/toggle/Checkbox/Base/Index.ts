import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/Checkbox/Base/Template');

class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value1: boolean = true;
    protected _value2: boolean = null;
    protected _value31: boolean = true;
    protected _value32: boolean = true;
    protected _value4: boolean = true;
    protected _value5: boolean = true;
    protected _value6: boolean = true;
}

export default Direction;
