import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/vertical/MarkerViewMode/Template';
import * as itemTemplate from 'wml!Controls-Wizard-demo/vertical/ItemTemplate/itemTemplate';

export default class MarkerViewMode extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _items: object[] = [
        {
            title: 'Заголовок 1',
            itemTemplate,
        },
        {
            title: 'Заголовок 2',
            itemTemplate,
        },
        {
            title: 'Заголовок 3',
            itemTemplate,
        },
    ];
}
