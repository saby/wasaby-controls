import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/horizontal/horizontalBase/HorizontalBase';
import { SyntheticEvent } from 'UICommon/Events';
import 'css!Controls-Wizard-demo/horizontal/resources/HorizontalBase';
import { Memory } from 'Types/source';

const LAST_STEP = 3;

export default class HorizontalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected selectedStepIndex: number;
    protected currentStepIndex: number;
    protected _displayMode: string = 'compact';

    protected _displayModeSource: Memory = new Memory({
        keyProperty: 'name',
        data: [
            {
                name: 'default',
                title: 'default',
            },
            {
                name: 'compact',
                title: 'compact',
            },
        ],
    });

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): void {
        this.selectedStepIndex = 0;
        this.currentStepIndex = 0;
    }

    protected finishStepHandler(event: SyntheticEvent<Event>, stepIndex: number): void {
        if (stepIndex !== LAST_STEP) {
            this.selectedStepIndex = this.currentStepIndex = stepIndex + 1;
            if (stepIndex > this.currentStepIndex) {
                this.currentStepIndex = stepIndex + 1;
            }
        }
    }

    protected nextStep(event: SyntheticEvent<Event>): void {
        const stepIndex: number = this.selectedStepIndex;
        this.finishStepHandler(event, stepIndex);
    }

    protected selectedStepIndexChangedHandler(
        event: SyntheticEvent<Event>,
        stepIndex: number
    ): void {
        if (stepIndex <= this.currentStepIndex) {
            this.selectedStepIndex = stepIndex;
        }
    }

    protected _displayModeChanged(e: Event, value: string): void {
        this._displayMode = value;
    }
}
