import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoHorizontal/News';

const STEP = 5;

export default class News extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected clickHandler(): void {
        this._notify('finishStep', [STEP, '№ 02556 6544 0522 0225']);
    }
}
