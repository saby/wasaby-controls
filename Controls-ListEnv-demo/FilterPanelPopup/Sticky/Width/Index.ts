import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanelPopup/Sticky/Width/Index';
import * as stackTemplate from 'wml!Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate';
import { Memory } from 'Types/source';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _stackTemplate: TemplateFunction = stackTemplate;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            widthData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [],
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            caption: '',
                            name: 'booleanEditor',
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
                            group: 'Город',
                            name: 'city',
                            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                            resetValue: ['1'],
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
                                extendedCaption: 'Город',
                            },
                        },
                        {
                            group: 'Должность',
                            name: 'position',
                            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
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
                        {
                            group: 'Должность',
                            name: 'position',
                            editorTemplateName: 'Controls/filterPanel:LookupEditor',
                            resetValue: ['1'],
                            caption: '',
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
                                multiSelect: true,
                                selectorTemplate: {
                                    templateName:
                                        'Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate',
                                    templateOptions: {
                                        items: [
                                            { id: '1', title: 'Разработчик' },
                                            { id: '2', title: 'Тестировщик' },
                                            { id: '3', title: 'Сборщик' },
                                        ],
                                    },
                                    popupOptions: {
                                        width: 300,
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        };
    }
}
