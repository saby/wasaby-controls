import { Control, TemplateFunction } from 'UI/Base';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/horizontal/horizontalBase2/Step2';

export default class Step2 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;

    protected finishStepHandler(): void {
        this._options.finishStepHandler(this._options.stepIndex);
    }
}
