import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/OneLoadOnInit/OneLoadOnInit';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
