import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Input/Area/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
