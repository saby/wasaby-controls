import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanelPopup/Sticky/TopTemplate/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: IFilterItem[] = [
        {
            caption: '',
            name: 'booleanEditor',
            editorTemplateName: 'Controls/filterPanelEditors:Boolean',
            resetValue: false,
            viewMode: 'basic',
            value: false,
            editorOptions: {
                value: true,
                extendedCaption: 'Без рабочих групп',
            },
        },
        {
            group: 'Город',
            name: 'city',
            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
            caption: '',
            value: ['1'],
            textValue: '',
            viewMode: 'basic',
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
            },
        },
        {
            group: 'Должность',
            name: 'position',
            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
            resetValue: ['1'],
            caption: '',
            value: ['1'],
            textValue: '',
            viewMode: 'basic',
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
