import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/FilterVisibilityCallback/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._filterButtonSource = [
            {
                caption: null,
                name: 'booleanEditor',
                editorTemplateName: 'Controls/filterPanel:TextEditor',
                resetValue: false,
                viewMode: 'extended',
                value: false,
                editorOptions: {
                    filterValue: true,
                    extendedCaption: 'Без рабочих групп',
                },
            },
            {
                name: 'city',
                editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                resetValue: ['1'],
                caption: 'Город',
                value: ['1'],
                textValue: '',
                viewMode: 'extended',
                filterVisibilityCallback:
                    'Controls-demo/filterPanelPopup/FilterVisibilityCallback/filterVisibilityCallback',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: '1', title: 'Yaroslavl' },
                            { id: '2', title: 'Moscow' },
                            { id: '3', title: 'St-Petersburg' },
                            { id: '4', title: 'Astrahan' },
                            { id: '5', title: 'Arhangelsk' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    extendedCaption: 'Город',
                },
            },
            {
                caption: 'Должность',
                name: 'position',
                editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                resetValue: ['1'],
                value: ['1'],
                textValue: '',
                viewMode: 'extended',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: '1', title: 'Разработчик' },
                            { id: '2', title: 'Тестировщик' },
                            { id: '3', title: 'Сборщик' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    extendedCaption: 'Должность',
                },
            },
        ];
    }
    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
    ];
}
