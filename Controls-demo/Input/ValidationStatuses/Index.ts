import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/ValidationStatuses/ValidationStatuses');

class ValidationStatuses extends Control<IControlOptions> {
    protected _validValue: string = ValidationStatuses._defaultValue;
    protected _invalidValue: string = ValidationStatuses._defaultValue;
    protected _invalidAccentValue: string = ValidationStatuses._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}

export default ValidationStatuses;
