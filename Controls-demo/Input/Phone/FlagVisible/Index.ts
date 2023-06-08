import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Phone/FlagVisible/Phone');

class Phone extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Phone;
