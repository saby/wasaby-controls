import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/HeaderContentTemplate/Index');

class HeaderContentTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
export default HeaderContentTemplate;
