import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/Href/Href');

class Href extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Href;
