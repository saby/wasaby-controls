import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Cut/Cut');

class Cut extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Cut;
