import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/Underline/Underline');

class Underline extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Underline;
