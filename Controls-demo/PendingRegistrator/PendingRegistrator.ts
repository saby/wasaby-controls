import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/PendingRegistrator/PendingRegistrator';

export default class PendingRegistrator extends Control {
    protected _template: TemplateFunction = template;
    static _styles = ['Controls-demo/PendingRegistrator/PendingRegistrator'];
}
