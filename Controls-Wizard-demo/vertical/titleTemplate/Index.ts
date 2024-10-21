import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/vertical/titleTemplate/Template';
import * as itemTitleTemplate from 'wml!Controls-Wizard-demo/vertical/titleTemplate/ItemTitle';
import * as itemContentTemplate from 'wml!Controls-Wizard-demo/vertical/titleTemplate/ItemContent';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _items: object[] = [
        {
            titleTemplate: itemTitleTemplate,
            title: 'Заголовок шага 1',
            itemContentTemplate,
            stepStyle: 'demo',
        },
        {
            titleTemplate: itemTitleTemplate,
            title: 'Заголовок шага 2',
            itemContentTemplate,
            stepStyle: 'demo',
        },
        {
            titleTemplate: itemTitleTemplate,
            title: 'Заголовок шага 3',
            itemContentTemplate,
            stepStyle: 'demo',
        },
    ];
}
