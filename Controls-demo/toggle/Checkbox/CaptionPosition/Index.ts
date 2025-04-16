import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/Checkbox/CaptionPosition/Template');

class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value1: boolean = false;
    protected _value2: boolean = false;
}

export default Direction;
