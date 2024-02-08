import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/StickyEnvironment/DataPinProvider/Base/Index';
import 'css!Controls-demo/StickyEnvironment/DataPinProvider/Base/Index';

export default class Index extends Control {
    protected _template: TemplateFunction = template;
}
