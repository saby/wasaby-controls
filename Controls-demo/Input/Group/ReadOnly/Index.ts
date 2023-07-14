import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import 'css!Controls-demo/Input/Group/ReadOnly/Style';
import controlTemplate = require('wml!Controls-demo/Input/Group/ReadOnly/Template');

class Example extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value1: string = '';
    protected _value2: string = '';
    protected _readOnlyField: boolean = false;
}

export default Example;
