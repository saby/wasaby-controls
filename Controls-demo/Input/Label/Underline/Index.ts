import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Label/Underline/Underline');

class Underline extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Underline;
