import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as validator from 'Controls-demo/Validate/TemplateName/Validators';
import controlTemplate = require('wml!Controls-demo/Validate/TemplateName/TemplateName');
import TemplateName = require('wml!Controls-demo/Validate/TemplateName/resources/TemplateName');
import TemplateOptions = require('wml!Controls-demo/Validate/TemplateName/resources/TemplateOptions');

class ErrorTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value1: string = '';
    protected _value2: string = '';
    protected _value3: string = '';
    private _validator: unknown = validator;
}

export default ErrorTemplate;
