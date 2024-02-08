import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalNew/Index';
import * as step from 'wml!Controls-Wizard-demo/verticalNew/steps/stepFive';
import { IWizardItem } from 'Controls-Wizard/verticalNew';
import { Record } from 'Types/entity';
import { Controller, IValidateResult } from 'Controls/validate';
import 'css!Controls-Wizard-demo/verticalNew/Index';

export default class VerticalNewBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _currentStepIndex: number = 0;
    protected _mode: string = 'edit';
    protected _items: IWizardItem[] = [
        {
            title: 'Виджет',
            contentTemplate: 'Controls-Wizard-demo/verticalNew/steps/stepFirst',
            contentTemplateOptions: {},
            record: new Record({
                rawData: {
                    siteAddress: 'www.www.www',
                    channelName: 'Имя канала не указано',
                    regulations: '1',
                    operator: 'Не указан',
                    appealType: 'Тип первый',
                },
            }),
            headerContentTemplate: '',
        },
        {
            title: 'Стиль',
            contentTemplate: 'Controls-Wizard-demo/verticalNew/steps/stepSecond',
            contentTemplateOptions: {},
            record: new Record({
                rawData: {
                    name: '',
                    phone: '',
                    email: '',
                    company: '',
                    message: '',
                },
            }),
            headerContentTemplate: '',
        },
        {
            title: 'Диалог',
            contentTemplate: 'Controls-Wizard-demo/verticalNew/steps/stepThird',
            contentTemplateOptions: {},
            required: false,
            record: new Record({
                rawData: {
                    mailText: '',
                },
            }),
            headerContentTemplate: '',
        },
        {
            title: 'С переключением',
            contentTemplate: 'Controls-Wizard-demo/verticalNew/steps/stepFourth',
            contentTemplateOptions: {},
            required: false,
            record: new Record({
                rawData: {
                    activate: false,
                },
            }),
            headerContentTemplate: '',
        },
        {
            title: 'Заголовок шага 5',
            contentTemplate: step,
            contentTemplateOptions: {
                rawData: {
                    siteAddress: 'www.www.www',
                    channelName: 'Имя канала не указано',
                    regulations: '1',
                    operator: 'Не указан',
                    appealType: 'Тип первый',
                },
            },
            record: new Record({
                rawData: {
                    siteAddress: '',
                    channelName: '',
                    regulations: '',
                    operator: 'Не указан',
                    appealType: 'Тип первый',
                },
            }),
            headerContentTemplate: '',
        },
    ];

    protected _getSaveButtonVisible(): boolean {
        return this._selectedStepIndex === 4 && this._mode !== 'view';
    }

    protected _onSave(): void {
        (this._children.validateController as Controller)
            .submit()
            .then((result: IValidateResult) => {
                if (!result.hasErrors) {
                    this._mode = 'view';
                }
            });
    }
}
