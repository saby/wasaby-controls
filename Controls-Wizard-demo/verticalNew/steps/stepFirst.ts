import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalNew/steps/stepFirst';
import { IWizardItem } from 'Controls-Wizard/verticalNew';

interface IStepFirst extends IWizardItem, IControlOptions {}

export default class StepFirst extends Control<IStepFirst> {
    protected _template: TemplateFunction = template;
}
