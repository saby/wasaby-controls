import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoHorizontal/Connection';

const STEP = 1;

export default class Connection extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected clickHandler(): void {
        this._notify('finishStep', [STEP, 'Компания Тензор, ООО (ИНН 76050116030)']);
    }
}
