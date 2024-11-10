import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Template from 'wml!Controls-demo/Scroll/StickyBlock/StickyGroup/HorizontalStackable/HorizontalStackable';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}
