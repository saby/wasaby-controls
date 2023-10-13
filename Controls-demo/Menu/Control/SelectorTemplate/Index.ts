import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/SelectorTemplate/Index');

class SelectorTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default SelectorTemplate;
