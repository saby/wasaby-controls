import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/FieldTemplate/FieldTemplate');

class FieldTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _value1: string = 'message';
    private _value2: string = 'message';
    private _value3: string = 'message';

    static _styles: string[] = ['Controls-demo/Input/FieldTemplate/FieldTemplate'];
}

export default FieldTemplate;
