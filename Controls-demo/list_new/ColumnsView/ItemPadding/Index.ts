import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/ItemPadding/Index');

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
}
