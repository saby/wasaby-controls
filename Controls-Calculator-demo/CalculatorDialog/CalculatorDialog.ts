import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Calculator-demo/CalculatorDialog/CalculatorDialog';

export default class CalculatorDialog extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _number: string = '';
}
