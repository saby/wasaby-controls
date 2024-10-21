import { Control, TemplateFunction } from 'UI/Base';
import SearchMemory from 'Controls-ListEnv-demo/ExtSearch/resources/SearchMemory';
import { Memory } from 'Types/source';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/ExtSearch/Index';
import { IFilterItem } from 'Controls/filter';
import { companyData, contractorData } from './resources/Source';
import 'css!Controls-ListEnv-demo/ExtSearch/Input';

const filterItems = [
    { id: 1, title: 'Название' },
    { id: 2, title: 'Описание папок' },
    { id: 3, title: 'Содержимое папок' },
    { id: 4, title: 'В текущем разделе' },
];

const navigation = {
    source: 'page',
    view: 'page',
    sourceConfig: {
        pageSize: 5,
        page: 0,
        hasMore: false,
    },
};

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _navigation: object = {
        source: 'page',
        view: 'page',
        sourceConfig: {
            pageSize: 5,
            page: 0,
            hasMore: false,
        },
    };
    protected _filterDescription: IFilterItem[];

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            settings: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [],
                    }),
                    searchParam: 'title',
                    keyProperty: 'id',
                    filterDescription: [
                        {
                            type: 'list',
                            name: 'city',
                            value: [],
                            resetValue: [],
                            caption: 'Контрагенты',
                            order: 1,
                            editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                            editorOptions: {
                                source: new SearchMemory({
                                    keyProperty: 'id',
                                    data: contractorData,
                                }),
                                navigation,
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                        },
                        {
                            name: 'company',
                            type: 'list',
                            value: null,
                            resetValue: null,
                            caption: 'Компании',
                            order: 0,
                            editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                            editorOptions: {
                                source: new SearchMemory({
                                    keyProperty: 'id',
                                    data: companyData,
                                }),
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
                                'Controls-ListEnv/filterPanelExtEditors:CheckboxGroupEditor',
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
