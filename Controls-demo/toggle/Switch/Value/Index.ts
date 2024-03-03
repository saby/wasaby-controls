import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/Switch/Value/Template');

class CaptionPosition extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value: boolean = true;
}
export default CaptionPosition;
