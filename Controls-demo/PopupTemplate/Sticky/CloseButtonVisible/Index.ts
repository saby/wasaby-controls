import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/CloseButtonVisible/Index');

class CloseButtonVisible extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
export default CloseButtonVisible;
