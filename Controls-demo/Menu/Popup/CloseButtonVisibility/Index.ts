import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/CloseButtonVisibility/Index');

class CloseButtonVisibility extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
export default CloseButtonVisibility;
