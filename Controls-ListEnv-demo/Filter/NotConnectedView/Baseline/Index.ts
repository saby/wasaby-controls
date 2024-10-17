import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/Baseline/Index';

export default class Baseline extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
}
