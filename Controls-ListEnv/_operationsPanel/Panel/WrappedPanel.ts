import { TemplateFunction, Control } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_operationsPanel/Panel/WrappedPanel';

export default class extends Control {
    protected _template: TemplateFunction = template;
}
