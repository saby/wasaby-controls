import { Control, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/list_new/Navigation/Cut/ContrastBackground/ContrastBackground';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
