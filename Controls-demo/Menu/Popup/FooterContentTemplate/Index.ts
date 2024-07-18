import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/FooterContentTemplate/Index');

class FooterContentTemplateDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
export default FooterContentTemplateDemo;
