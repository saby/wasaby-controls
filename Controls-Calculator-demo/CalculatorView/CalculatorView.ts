import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Calculator-demo/CalculatorView/CalculatorView';
import 'css!Controls-Calculator-demo/CalculatorView/CalculatorView';

export default class CalculatorView extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
