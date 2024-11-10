import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Money/ReadOnly/Index');

class Index extends Control<IControlOptions> {
    protected _value1: number = 512;
    protected _value2: number = 512;
    protected _template: TemplateFunction = controlTemplate;
}

export default Index;
