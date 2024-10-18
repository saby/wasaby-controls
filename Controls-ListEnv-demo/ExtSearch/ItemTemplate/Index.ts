import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/ExtSearch/ItemTemplate/Index';
import * as itemTemplate from 'wml!Controls-ListEnv-demo/ExtSearch/resources/ItemTemplate';
import { IFilterItem } from 'Controls/filter';
import 'css!Controls-ListEnv-demo/ExtSearch/Input';

const filterItems = [
    { id: 1, title: 'Один', type: 'short' },
    { id: 2, title: 'Триста тридцать шесть', type: 'long' },
    { id: 3, title: 'Два', type: 'short' },
    { id: 4, title: 'Шестьсот сорок восемь', type: 'long' },
    { id: 5, title: 'Три', type: 'short' },
];

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _filterDescription: IFilterItem[];

    protected _beforeMount(): void {
        this._filterDescription = [
            {
                name: 'owner',
                resetValue: [],
                value: [],
                textValue: '',
                editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:CheckboxGroupEditor',
                editorOptions: {
                    multiSelect: true,
                    direction: 'horizontal',
                    keyProperty: 'id',
                    displayProperty: 'title',
                    itemTemplate,
                    source: new Memory({
                        data: filterItems,
                        keyProperty: 'id',
                    }),
                },
            },
        ];
    }

    protected _filterDescriptionChanged(event: Event, filterDescription: IFilterItem[]): void {
        this._filterDescription = filterDescription;
    }
}
