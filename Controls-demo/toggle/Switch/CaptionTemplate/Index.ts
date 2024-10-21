import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/Switch/CaptionTemplate/Template');
import additionalCaptionTemplate = require('wml!Controls-demo/toggle/Switch/CaptionTemplate/resources/captionTemplate');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _captionTemplate: TemplateFunction = additionalCaptionTemplate;
    protected _value: boolean = true;
    protected _value2: boolean = true;
}
export default Base;
