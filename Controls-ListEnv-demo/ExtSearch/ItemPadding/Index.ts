import { Control, TemplateFunction } from 'UI/Base';
import SearchMemory from 'Controls-ListEnv-demo/ExtSearch/resources/SearchMemory';
import { Memory } from 'Types/source';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/ExtSearch/ItemPadding/Index';
import { IFilterItem } from 'Controls/filter';
import { contractorData } from '../resources/Source';
import 'css!Controls-ListEnv-demo/ExtSearch/Input';

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
                            editorTemplateName: 'Controls/filterPanel:LookupEditor',
                            editorOptions: {
                                source: new SearchMemory({
                                    keyProperty: 'id',
                                    data: contractorData,
                                }),
                                navigation,
                                displayProperty: 'title',
                                keyProperty: 'id',
                                suggestItemPadding: {
                                    top: 's',
                                    bottom: 's',
                                    left: 'xl',
                                    right: 'xl',
                                },
                            },
                        },
                    ],
                },
            },
        };
    }
}
