import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Area/FooterTemplate/Index');

class TextAlignments extends Control<IControlOptions> {
    protected _value: string = 'text';
    protected _value1: string = 'message';
    protected _template: TemplateFunction = controlTemplate;
}

export default TextAlignments;
