import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalBase/VerticalBase';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected selectedStepIndex: number = 2;
    protected items: object[] = [
        {
            title: 'Заголовок шага 1',
            titleContentTemplate: 'Подзаголовок шага 1',
            itemContentTemplate: 'Содержание шага 1',
        },
        {
            title: 'Заголовок шага 2',
            titleContentTemplate: 'Подзаголовок шага 2',
            itemContentTemplate: 'Содержание шага 2',
        },
        {
            title: 'Заголовок шага 3',
            titleContentTemplate: 'Подзаголовок шага 3',
            itemContentTemplate: 'Содержание шага 3',
        },
        {
            title: 'Заголовок шага 4',
            titleContentTemplate: 'Подзаголовок шага 4',
            itemContentTemplate: 'Содержание шага 4',
        },
        {
            title: 'Заголовок шага 5',
            titleContentTemplate: 'Подзаголовок шага 5',
            itemContentTemplate: 'Содержание шага 5',
        },
    ];
}
