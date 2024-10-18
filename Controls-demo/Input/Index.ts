import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Template');

class Text extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Text;
