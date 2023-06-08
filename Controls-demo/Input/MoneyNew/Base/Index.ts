import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/MoneyNew/Base/Index');

class Index extends Control<IControlOptions> {
    protected _value: string = '';
    protected _value1: string = '0.00';
    protected _value2: string = '0.00';
    protected _value3: string = '512.64';
    protected _template: TemplateFunction = controlTemplate;
}
export default Index;
