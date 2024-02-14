import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalNew/steps/stepSecond';
import { IWizardItem } from 'Wizard/verticalNew';

interface IStepSecond extends IWizardItem, IControlOptions {}

export default class StepSecond extends Control<IStepSecond> {
    protected _template: TemplateFunction = template;
}
