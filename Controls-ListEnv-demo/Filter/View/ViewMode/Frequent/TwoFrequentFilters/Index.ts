import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/TwoFrequentFilters/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            persons: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            {
                                id: 'Новиков Д.В.',
                                title: 'Новиков Д.В.',
                                department: 'Разработка',
                            },
                            {
                                id: 'Кошелев А.Е.',
                                title: 'Кошелев А.Е.',
                                department: 'Разработка',
                            },
                            {
                                id: 'Субботин А.В.',
                                title: 'Субботин А.В.',
                                department: 'Бухгалтерия',
                            },
                        ],
                        keyProperty: 'department',
                        filter,
                    }),
                    filterDescription: [
                        {
                            name: 'response',
                            value: null,
                            resetValue: null,
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        {
                                            id: 'Новиков Д.В.',
                                            title: 'Новиков Д.В.',
                                        },
                                        {
                                            id: 'Кошелев А.Е.',
                                            title: 'Кошелев А.Е.',
                                        },
                                        {
                                            id: 'Субботин А.В.',
                                            title: 'Субботин А.В.',
                                        },
                                    ],
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                            viewMode: 'frequent',
                        },
                        {
                            name: 'department',
                            value: null,
                            resetValue: null,
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        {
                                            id: 'Разработка',
                                            title: 'Разработка',
                                        },
                                        {
                                            id: 'Бухгалтерия',
                                            title: 'Бухгалтерия',
                                        },
                                    ],
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                            viewMode: 'frequent',
                        },
                    ],
                    displayProperty: 'title',
                },
            },
        };
    }
}
