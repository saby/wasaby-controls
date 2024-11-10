import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Label/Label');

class Label extends Control<IControlOptions> {
    protected _value: string = Label._defaultValue;
    protected _requiredValue: string = Label._defaultValue;
    protected _topValue: string = Label._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}
export default Label;
