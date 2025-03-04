import { IControlOptions } from 'UI/Base';

export interface IDemoStepOptions extends IControlOptions {
    finishStepHandler: Function;
    stepBackHandler: Function;
    finishWizardHandler: Function;
    stepIndex: number;
    textInputValue?: string;
}
