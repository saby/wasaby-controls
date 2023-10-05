import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Label/Href/Href');

class Href extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Href;
