import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/SuggestSearchInput/Base/Index';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { employees, contractorData, companyData } from './resources/Source';
import SearchMemory from './resources/SearchMemory';
import FilterMemory from './resources/FilterMemory';
import 'css!Controls-ListEnv-demo/SuggestSearchInput/Base/Index';

const navigation = {
    source: 'page',
    view: 'page',
    sourceConfig: {
        pageSize: 5,
        page: 0,
        hasMore: false,
    },
};

const filterItems = [
    { id: 1, title: 'Название' },
    { d: 2, title: 'Описание папок' },
    { id: 3, title: 'Содержимое папок' },
    { id: 4, title: 'В текущем разделе' },
];

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    static getLoadConfig(): unknown {
        return {
            employees: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new FilterMemory({
                        keyProperty: 'id',
                        data: employees,
                    }),
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    searchParam: 'title',
                    columns: [
                        {
                            displayProperty: 'title',
                        },
                    ],
                    keyProperty: 'id',
                    filterButtonSource: [
                        {
                            type: 'list',
                            name: 'city',
                            id: 'city',
                            value: [],
                            resetValue: [],
                            caption: 'Контрагенты',
                            order: 1,
                            editorTemplateName:
                                'Controls/filterPanel:LookupEditor',
                            editorOptions: {
                                source: new SearchMemory({
                                    keyProperty: 'id',
                                    data: contractorData,
                                }),
                                type: 'list',
                                navigation,
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                        },
                        {
                            name: 'company',
                            type: 'list',
                            id: 'company',
                            value: null,
                            resetValue: null,
                            caption: 'Компании',
                            order: 0,
                            editorTemplateName:
                                'Controls/filterPanel:LookupEditor',
                            editorOptions: {
                                source: new SearchMemory({
                                    keyProperty: 'id',
                                    data: companyData,
                                }),
                                type: 'list',
                                navigation,
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                        },
                        {
                            name: 'owner',
                            resetValue: [],
                            value: [],
                            textValue: '',
                            editorTemplateName:
                                'Controls/filterPanelExtEditors:CheckboxGroupEditor',
                            editorOptions: {
                                multiSelect: true,
                                direction: 'horizontal',
                                keyProperty: 'id',
                                displayProperty: 'title',
                                source: new Memory({
                                    data: filterItems,
                                    keyProperty: 'id',
                                }),
                            },
                        },
                    ],
                },
            },
        };
    }
}
