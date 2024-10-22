import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Width/Index');

class Index extends Control<IControlOptions> {
    protected _value1: string = null;
    protected _value2: string = null;
    protected _template: TemplateFunction = controlTemplate;
}
export default Index;
