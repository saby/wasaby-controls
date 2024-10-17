import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/common/step/Quiz';

export default class Quiz extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _notifyCorrect(): void {
        this._notify('finishStep', [true]);
    }

    protected _notifyIncorrect(): void {
        this._notify('finishStep', [false]);
    }
}
