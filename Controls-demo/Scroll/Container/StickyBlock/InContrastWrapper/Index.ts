import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Container/StickyBlock/InContrastWrapper/Template');
import 'css!Controls-demo/Scroll/Container/StickyBlock/InContrastWrapper/Style';

export default class InContrastWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/StickyBlock/StickyBlock'];
}
