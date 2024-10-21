import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Switch/ResetValueDoc/Template';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _resetValue: boolean = false;
    protected _value: boolean = true;
    protected _value2: boolean = false;
}
export default Base;
