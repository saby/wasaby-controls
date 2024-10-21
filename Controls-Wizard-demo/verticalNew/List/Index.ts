import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalNew/List/Index';
import { IWizardItem } from 'Controls-Wizard/verticalNew';
import { Record } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';

export default class VerticalNewBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _currentStepIndex: number = 2;
    protected _items: IWizardItem[] = [
        {
            title: 'Виджет',
            record: new Record({}),
            headerContentTemplate: '',
        },
        {
            title: 'Стиль',
            record: new Record({}),
            headerContentTemplate: '',
        },
        {
            title: 'Диалог',
            required: false,
            record: new Record({}),
            headerContentTemplate: '',
        },
        {
            title: 'С переключением',
            record: new Record({}),
            headerContentTemplate: '',
        },
        {
            title: 'Заголовок шага 5',
            record: new Record({}),
            headerContentTemplate: '',
        },
    ];

    protected _indexChanged(
        event: SyntheticEvent<MouseEvent>,
        nextStep: number,
        isNextButton: boolean
    ): void {
        this._selectedStepIndex = nextStep;
        if (isNextButton) {
            this._currentStepIndex = nextStep;
        }
    }
}
