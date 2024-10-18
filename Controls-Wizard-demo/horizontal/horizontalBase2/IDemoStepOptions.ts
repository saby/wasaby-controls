import { IControlOptions } from 'UI/Base';

export interface IDemoStepOptions extends IControlOptions {
    finishStepHandler: Function;
    stepIndex: number;
}
