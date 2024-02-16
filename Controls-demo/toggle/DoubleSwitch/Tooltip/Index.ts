import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/DoubleSwitch/Tooltip/Template');

class Tooltip extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: boolean = false;
    protected _value2: boolean = false;
}
export default Tooltip;
