import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Button/WithoutItems/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
