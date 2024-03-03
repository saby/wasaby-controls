import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoHorizontal/Horizontal';
import { SyntheticEvent } from 'UICommon/Events';
import 'css!Controls-Wizard-demo/demoHorizontal/Horizontal';

const LAST_STEP = 3;

export default class WizardDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected selectedStepIndex: number;
    protected currentStepIndex: number;
    private subtitles: string[] = [];
    private finishedArray: boolean[] = [];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): void {
        this.selectedStepIndex = 0;
        this.currentStepIndex = 0;
    }

    protected finishStepHandler(
        event: SyntheticEvent<Event>,
        stepIndex: number,
        subtitle: string
    ): void {
        this.subtitles[stepIndex] = subtitle;

        if (stepIndex !== LAST_STEP) {
            this.selectedStepIndex = this.currentStepIndex = stepIndex + 1;
        }

        this.finishedArray[stepIndex] = true;
        this._forceUpdate();
    }

    protected selectedStepIndexChangedHandler(
        event: SyntheticEvent<Event>,
        stepIndex: number
    ): void {
        if (stepIndex <= this.currentStepIndex) {
            this.selectedStepIndex = stepIndex;
        }
    }
}
