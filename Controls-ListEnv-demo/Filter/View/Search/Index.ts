import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as filter from './Utils/DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Search/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            cities: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            {
                                id: '1',
                                title: 'Yaroslavl city',
                                city: 'Yaroslavl',
                            },
                            { id: '2', title: 'Moscow city', city: 'Moscow' },
                            { id: '3', title: 'Kazan city', city: 'Kazan' },
                        ],
                        filter,
                    }),
                    filterDescription: [
                        {
                            name: 'city',
                            value: null,
                            resetValue: null,
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        { id: 'Yaroslavl', city: 'Yaroslavl' },
                                        { id: 'Moscow', city: 'Moscow' },
                                        { id: 'Kazan', city: 'Kazan' },
                                    ],
                                }),
                                displayProperty: 'city',
                                keyProperty: 'id',
                            },
                            viewMode: 'frequent',
                        },
                    ],
                    searchParam: 'city',
                    displayProperty: 'city',
                },
            },
        };
    }
}
