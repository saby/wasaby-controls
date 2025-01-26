import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';

import * as template from 'wml!Controls-Wizard-demo/vertical/backgroundStyle/Template';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;

    protected _finishStepHandler(e: SyntheticEvent<Event>, result: boolean): void {
        this._selectedStepIndex++;
    }
}
