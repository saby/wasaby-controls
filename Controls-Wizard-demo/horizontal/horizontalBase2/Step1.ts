import { Control, TemplateFunction } from 'UI/Base';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/horizontal/horizontalBase2/Step1';

export default class Step1 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;

    protected finishStepHandler(): void {
        this._options.finishStepHandler(this._options.stepIndex);
    }
}
