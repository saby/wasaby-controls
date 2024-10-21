import { Control, TemplateFunction } from 'UI/Base';
import * as filter from '../resources/DataFilter';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/Alignment/Index';

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
                    filterDescription: [
                        {
                            name: 'response',
                            value: 'Новиков Д.В.',
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
                    ],
                    source: new Memory({
                        data: [
                            { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                            { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                            { id: 'Субботин А.В.', title: 'Субботин А.В.' },
                        ],
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'id',
                    viewMode: 'list',
                    displayProperty: 'title',
                },
            },
        };
    }
}
