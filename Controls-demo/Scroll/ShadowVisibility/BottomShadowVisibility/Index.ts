import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/ShadowVisibility/BottomShadowVisibility/Template');

export default class BottomShadowVisibility extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/Scroll/ShadowVisibility/Style'];
}
