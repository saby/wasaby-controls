import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/HorizontalScroll/Overlay/Overlay';
import 'css!Controls-demo/HorizontalScroll/Overlay/Overlay';

export default class Index extends Control {
    protected _template: TemplateFunction = Template;
}
