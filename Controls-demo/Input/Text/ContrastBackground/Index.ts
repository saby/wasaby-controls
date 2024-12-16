import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Text/ContrastBackground/Template');

class ContrastBackground extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: string;
}

export default ContrastBackground;
