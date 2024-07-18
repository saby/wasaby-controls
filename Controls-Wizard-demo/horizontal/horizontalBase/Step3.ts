import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/horizontal/horizontalBase/Step3';

const STEP = 2;

export default class Step3 extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected clickHandler(): void {
        this._notify('finishStep', [STEP]);
    }
}
