import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/ContrastBackground/ContrastBackground');

class ContrastBackground extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default ContrastBackground;
