import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/DoubleSwitch/Size/Template';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value1: boolean = true;
    protected _value2: boolean = true;
    protected _value3: boolean = true;
}
export default Base;
