import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Phone/Phone');

class Phone extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Phone;
