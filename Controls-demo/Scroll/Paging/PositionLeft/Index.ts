import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Paging/PositionLeft/Template');
import * as scroll from 'Controls/scroll';

export default class DefaultScrollDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/Scroll/Paging/Basic/Style'];
}
