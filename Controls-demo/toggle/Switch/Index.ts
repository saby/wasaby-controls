import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Switch/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _resetValue: boolean = false;
    protected _sizeValue: boolean = false;
}
