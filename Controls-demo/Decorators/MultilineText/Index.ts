import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorators/MultilineText/Index');
import 'css!Controls-demo/Decorators/MultilineText/Index';

class Index extends Control<IControlOptions> {
    protected _value1: string = '';
    protected _template: TemplateFunction = controlTemplate;
}
export default Index;
