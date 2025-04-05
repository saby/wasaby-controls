import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Buttons/button';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
