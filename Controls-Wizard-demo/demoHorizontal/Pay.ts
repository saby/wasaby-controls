import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoHorizontal/Pay';

const STEP = 2;

export default class Pay extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected clickHandler(): void {
        this._notify('finishStep', [STEP, '3 000 о карте *8865']);
    }
}
