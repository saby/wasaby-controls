import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalNew/steps/stepFourth';
import { SyntheticEvent } from 'UICommon/Events';
import { IWizardItem } from 'Wizard/verticalNew';

interface IStepFourth extends IWizardItem, IControlOptions {}

export default class StepFourth extends Control<IStepFourth> {
    protected _template: TemplateFunction = template;

    protected _onClickButton(event: SyntheticEvent<Event>, newValue: boolean): void {
        this._options.record.set('activate', newValue);
    }
}
