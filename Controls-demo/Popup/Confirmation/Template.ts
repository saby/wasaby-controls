import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Confirmation/Template');

class ConfirmationTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default ConfirmationTemplate;
