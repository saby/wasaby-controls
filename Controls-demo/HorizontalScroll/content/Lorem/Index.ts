import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/HorizontalScroll/content/Lorem/Lorem';

export default class Index extends Control {
    protected _template: TemplateFunction = Template;
}
