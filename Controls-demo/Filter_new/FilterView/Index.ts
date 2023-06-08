import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/FilterView';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
