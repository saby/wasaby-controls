import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/DifferentHeights/DifferentHeights';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
