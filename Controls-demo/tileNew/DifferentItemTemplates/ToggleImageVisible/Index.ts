import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ToggleImageVisible';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
