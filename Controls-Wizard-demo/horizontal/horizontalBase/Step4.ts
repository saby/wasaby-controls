import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/horizontal/horizontalBase/Step4';

const STEP = 3;

export default class Step4 extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected clickHandler(): void {
        this._notify('finishStep', [STEP]);
    }
}
