import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/DoubleSwitch/ViewMode/Template';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value1: boolean = false;
    protected _value2: boolean = false;
}
export default Base;
