import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Number/ShowEmptyDecimals/Index');

class Index extends Control<IControlOptions> {
    protected _value1: number = 123.0;
    protected _value2: number = 123.0;
    protected _template: TemplateFunction = controlTemplate;
}
export default Index;
