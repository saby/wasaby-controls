import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Stack/HeaderBorderVisible/HeaderBorderVisible');

class HeaderBorderVisible extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default HeaderBorderVisible;
