import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/EditInPlace';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
