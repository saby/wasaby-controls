import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Stack/RightBorderVisible/RightBorderVisible');

class HeaderBorderVisible extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
export default HeaderBorderVisible;
