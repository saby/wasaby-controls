import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Scroll/Paging/Begin/Template');

export default class DefaultScrollDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['Controls-demo/Scroll/Paging/Basic/Style'];
}
