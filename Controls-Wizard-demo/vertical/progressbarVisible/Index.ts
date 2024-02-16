import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';

import * as template from 'wml!Controls-Wizard-demo/vertical/progressbarVisible/Template';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _results: string[] = [];

    protected _finishStepHandler(e: SyntheticEvent<Event>, result: boolean): void {
        this._results[this._selectedStepIndex] = result ? 'success' : 'danger';
        this._selectedStepIndex++;
    }
}
