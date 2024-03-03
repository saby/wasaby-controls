import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalNew/steps/stepThird';
import { IWizardItem } from 'Controls-Wizard/verticalNew';

interface IStepThird extends IWizardItem, IControlOptions {}

export default class StepThird extends Control<IStepThird> {
    protected _template: TemplateFunction = template;
}
