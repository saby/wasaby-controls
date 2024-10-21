import { IWizardItem } from 'Controls-Wizard/verticalNew';
import { Record } from 'Types/entity';
import * as step from 'wml!Controls-Wizard-demo/verticalNew/steps/stepFive';

export const items: IWizardItem[] = [
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
