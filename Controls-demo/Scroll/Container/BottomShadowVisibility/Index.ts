import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Container/BottomShadowVisibility/Template');

export default class BottomShadowVisibility extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
