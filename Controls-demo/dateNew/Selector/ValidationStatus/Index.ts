import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dateNew/Selector/ValidationStatus/Index';

class ValidationStatus extends Control {
    protected _template: TemplateFunction = template;
}

export default ValidationStatus;
