import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Require/Require');

class Require extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _requiredValue: string;
    protected _requiredValue1: string;
}
export default Require;
