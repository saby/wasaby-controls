import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/ViewMode/Index';
import * as stackTemplate from 'wml!Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _stackTemplate: TemplateFunction = stackTemplate;
    protected _filterButtonData: unknown[] = [];
    protected _source: Memory = null;
    protected _navigation: object = null;
    protected _filterItems: object[] = null;

    protected _beforeMount(): void {
        this._filterButtonData = [
            {
                caption: 'Статус',
                name: 'status',
                editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                resetValue: ['1'],
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
                    extendedCaption: 'Статус',
                },
            },
            {
                caption: 'Должность',
                name: 'position',
                editorTemplateName: 'Controls/filterPanel:LookupEditor',
                resetValue: ['1'],
                value: ['1'],
                textValue: '',
                viewMode: 'extended',
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
                    extendedCaption: 'Должность',
                    multiSelect: true,
                    selectorTemplate: {
                        templateName:
                            'Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate',
                        templateOptions: {
                            items: [
                                { id: '1', title: 'Yaroslavl' },
                                { id: '2', title: 'Moscow' },
                                { id: '3', title: 'St-Petersburg' },
                                { id: '4', title: 'Astrahan' },
                                { id: '5', title: 'Arhangelsk' },
                            ],
                        },
                        popupOptions: {
                            width: 300,
                        },
                    },
                },
            },
            {
                caption: '',
                name: 'booleanEditor2',
                editorTemplateName: 'Controls/filterPanel:TextEditor',
                resetValue: false,
                viewMode: 'basic',
                value: false,
                editorOptions: {
                    value: true,
                    extendedCaption: 'Без рабочих групп',
                },
            },
            {
                caption: 'Пол',
                name: 'gender',
                resetValue: '1',
                viewMode: 'extended',
                value: '1',
                textValue: 'Мужской',
                editorTemplateName:
                    'Controls/filterPanelExtEditors:TumblerEditor',
                editorOptions: {
                    extendedCaption: 'Пол',
                    items: new RecordSet({
                        rawData: [
                            {
                                id: '1',
                                caption: 'Мужской',
                            },
                            {
                                id: '2',
                                caption: 'Женский',
                            },
                        ],
                        keyProperty: 'id',
                    }),
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
