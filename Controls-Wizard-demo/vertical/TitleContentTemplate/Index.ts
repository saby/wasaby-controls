import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/vertical/TitleContentTemplate/Index';
import * as contentTemplate from 'wml!Controls-Wizard-demo/common/step/Simple';
import * as titleContent from 'Controls-Wizard-demo/vertical/TitleContentTemplate/TitleContent/TitleContent';
import { SyntheticEvent } from 'UICommon/Events';
import { ReactiveObject } from 'Types/entity';

interface IItem {
    title: string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    titleContentTemplate: any;
}

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _items: IItem[] = [];
    private _canChangeStep: boolean = true;

    protected _beforeMount(options: IControlOptions): void {
        const amountOfItems = 10;
        for (let i = 0; i < amountOfItems; i++) {
            this._items.push(
                new ReactiveObject({
                    title: `Заголовок шага ${i}`,
                    contentTemplate,
                    stepStyle: 'demo',
                    titleContentTemplate: i === 0 ? titleContent : undefined,
                    titleContentTemplateOptions: {
                        revertStep: this._revertStep.bind(this),
                    },
                })
            );
        }
    }

    private _revertStep(): void {
        if (this._selectedStepIndex === 0) {
            return;
        }

        this._items[this._selectedStepIndex].titleContentTemplate = undefined;
        this._items[this._selectedStepIndex--].titleContentTemplate = titleContent;
        this._canChangeStep = false;
    }

    protected _selectedStepIndexChangedHandler(e: SyntheticEvent, curStep: number): void {
        if (!this._canChangeStep) {
            this._canChangeStep = !this._canChangeStep;
            return;
        }

        this._items[this._selectedStepIndex].titleContentTemplate = undefined;
        this._items[curStep].titleContentTemplate = titleContent;
        this._selectedStepIndex = curStep;
    }
}
