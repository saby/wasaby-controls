import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoVertical/Vertical';
import * as titleContentTemplate from 'wml!Controls-Wizard-demo/demoVertical/TitleContentTemplateStep2';
import { SyntheticEvent } from 'UICommon/Events';
import 'css!Controls-Wizard-demo/common/Vertical';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected selectedStepIndex: number;
    protected currentStepIndex: number;
    protected _titleContentTemplateOptions: object = {
        additionalText: '(выберите один из пунктов)',
    };
    protected _titleContentTemplate: TemplateFunction = titleContentTemplate;
    protected finishedArray: boolean[] = [false, false, false, true];
    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): void {
        this.selectedStepIndex = 0;
        this.currentStepIndex = 0;
    }

    protected finishStepHandler(event: SyntheticEvent<Event>, stepIndex: number): void {
        this.selectedStepIndex = stepIndex + 1;
        this.finishedArray[stepIndex] = true;
        if (stepIndex === 2) {
            this.selectedStepIndex = 4;
        }
        this._forceUpdate();
    }

    protected finishWizardHandler(): void {
        this.selectedStepIndex = 5;
        this.finishedArray = [true, true, true, true];
    }

    protected stepBackHandler(event: SyntheticEvent<Event>, stepIndex: number): void {
        this.selectedStepIndex = stepIndex;
        this.finishedArray = [true, false, false, true];
    }
}
