import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Highlight/Highlight');

class Highlight extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Highlight;
