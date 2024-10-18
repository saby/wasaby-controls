import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Container/StickyBlock/MultiHeader/Template');

export default class MultiHeaderDemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = [
        'Controls-demo/Scroll/Container/StickyBlock/MultiHeader/MultiHeader',
    ];
}
