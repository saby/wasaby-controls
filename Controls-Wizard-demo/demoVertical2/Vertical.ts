import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { IVerticalItem } from 'Controls-Wizard/vertical';
import { ReactiveObject } from 'Types/entity';
import * as template from 'wml!Controls-Wizard-demo/demoVertical2/Vertical';
import 'css!Controls-Wizard-demo/common/Vertical';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected selectedStepIndex: number;
    // @ts-ignore
    protected _items: ReactiveObject<IVerticalItem>;
    protected _step4: IVerticalItem;
    protected _itemBackgroundStyle: object = {
        future: 'notContrast',
        active: 'default',
        completed: 'default',
    };
    protected _leftPadding: boolean = true;
    protected _isBlockLayout: boolean = true;
    protected _mode: string = 'edit';
    protected _showCompletedSteps: boolean = true;
    protected _showBigMarkerSize: boolean = false;

    protected _beforeMount(): void {
        this.selectedStepIndex = 0;
        this._items = [
            new ReactiveObject({
                title: 'Если входящий документ',
                contentTemplate: 'Controls-Wizard-demo/demoVertical2/VerticalStep1',
                contrastBackgroundCompleted: true,
                contentTemplateOptions: {
                    finishStepHandler: this.finishStepHandler,
                    finishWizardHandler: this.finishWizardHandler,
                    textInputValue: 'Лопырев договор',
                    finished: false,
                },
            }),
            new ReactiveObject({
                title: 'Регистрируем как',
                contentTemplate: 'Controls-Wizard-demo/demoVertical2/VerticalStep2',
                contentTemplateOptions: {
                    finishStepHandler: this.finishStepHandler,
                    finishWizardHandler: this.finishWizardHandler,
                    stepBackHandler: this.stepBackHandler,
                    finished: false,
                },
            }),
            new ReactiveObject({
                title: 'В качестве ответственного назначить',
                contentTemplate: 'Controls-Wizard-demo/demoVertical2/VerticalStep3',
                contentTemplateOptions: {
                    finishStepHandler: this.finishStepHandler,
                    finishWizardHandler: this.finishWizardHandler,
                    stepBackHandler: this.stepBackHandler,
                    finished: false,
                },
            }),
        ];
        this._step4 = new ReactiveObject({
            title: 'Если ответственный не определится, то можно будет назначить',
            contentTemplate: 'Controls-Wizard-demo/demoVertical2/VerticalStep4',
            contentTemplateOptions: {
                finishStepHandler: this.finishStepHandler,
                finishWizardHandler: this.finishWizardHandler,
                stepBackHandler: this.stepBackHandler,
                finished: true,
            },
        });
    }

    protected finishStepHandler = (event: SyntheticEvent<Event>, stepIndex: number): void => {
        this.selectedStepIndex = stepIndex + 1;
        this._items[stepIndex].contentTemplateOptions = {
            finishStepHandler: this.finishStepHandler,
            finishWizardHandler: this.finishWizardHandler,
            stepBackHandler: this.stepBackHandler,
            finished: true,
        };

        if (stepIndex === 2) {
            if (this._items.length === 3) {
                this._items.push(this._step4);
            }
            this.selectedStepIndex = 3;
        }

        if (stepIndex === 3 && this._items.length === 4) {
            this._items.pop();
            this._setFinishWizard();
        }
        this._forceUpdate();
    };

    protected finishWizardHandler = (event: SyntheticEvent<Event>, stepIndex: number) => {
        if (this._items.length === 4) {
            this._items.pop();
        }
        this._items[2].contentTemplateOptions = {
            finishStepHandler: this.finishStepHandler,
            finishWizardHandler: this.finishWizardHandler,
            stepBackHandler: this.stepBackHandler,
            finished: true,
        };
        this.selectedStepIndex = 5;
        this._setFinishWizard();
    };

    private _setFinishWizard(): void {
        this._showCompletedSteps = false;
        this._leftPadding = false;
        this._isBlockLayout = false;
        this._mode = 'view';
    }

    protected stepBackHandler = (event: SyntheticEvent<Event>, stepIndex: number): void => {
        this._items[1].contentTemplateOptions = this._items[2].contentTemplateOptions = {
            finishStepHandler: this.finishStepHandler,
            finishWizardHandler: this.finishWizardHandler,
            stepBackHandler: this.stepBackHandler,
            finished: false,
        };

        if (this._items.length === 4) {
            this._items.pop();
        }
        this.selectedStepIndex = 1;
    };
}
