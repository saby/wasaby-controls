import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/LookupNew/ReadOnly/ReadOnly';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
