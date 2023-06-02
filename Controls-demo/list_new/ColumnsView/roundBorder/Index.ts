import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ColumnsView/roundBorder/RoundBorder';

/**
 * Демка для автотеста
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
}
