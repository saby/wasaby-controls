import { Control, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/list_new/Navigation/Cut/ButtonPosition/ButtonPosition';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
