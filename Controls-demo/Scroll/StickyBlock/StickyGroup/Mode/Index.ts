import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Scroll/StickyBlock/StickyGroup/Mode/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}
