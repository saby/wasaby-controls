import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Number/OnlyPositive/Index');

class Index extends Control<IControlOptions> {
    protected _value1: number = null;
    protected _value2: number = null;
    protected _template: TemplateFunction = controlTemplate;
}
export default Index;
