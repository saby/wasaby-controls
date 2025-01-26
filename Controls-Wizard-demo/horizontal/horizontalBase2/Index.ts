import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import * as template from 'wml!Controls-Wizard-demo/horizontal/horizontalBase2/HorizontalBase';
import * as step2template from 'wml!Controls-Wizard-demo/horizontal/horizontalBase2/Step2';
import 'css!Controls-Wizard-demo/horizontal/resources/HorizontalBase';

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

    protected items: Object[];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): void {
        this.selectedStepIndex = 0;
        this.currentStepIndex = 0;

        this.items = [
            {
                title: 'Тип подключаемого оборудования',
                template: 'Controls-Wizard-demo/horizontal/horizontalBase2/Step1',
                templateOptions: {
                    finishStepHandler: this.finishStepHandler.bind(this),
                    stepIndex: 0,
                },
            },
            {
                title: 'Номера',
                template: step2template,
                templateOptions: {
                    finishStepHandler: this.finishStepHandler.bind(this),
                    stepIndex: 1,
                },
            },
            {
                title: 'Тарифный план',
                template: 'Controls-Wizard-demo/horizontal/horizontalBase2/Step3',
                templateOptions: {
                    finishStepHandler: this.finishStepHandler.bind(this),
                    stepIndex: 2,
                },
            },
            {
                title: 'Подключение',
                template: 'Controls-Wizard-demo/horizontal/horizontalBase2/Step4',
                templateOptions: {
                    finishStepHandler: this.finishStepHandler.bind(this),
                    stepIndex: 3,
                },
            },
        ];
    }

    protected finishStepHandler(stepIndex: number): void {
        if (stepIndex !== LAST_STEP) {
            this.selectedStepIndex = this.currentStepIndex = stepIndex + 1;
            if (stepIndex > this.currentStepIndex) {
                this.currentStepIndex = stepIndex + 1;
            }
        }
    }

    protected nextStep(): void {
        const stepIndex: number = this.selectedStepIndex;
        this.finishStepHandler(stepIndex);
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
