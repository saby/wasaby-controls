import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Input/MoneyNew/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
