import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Label/Require/Require');

class Require extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Require;
