import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/DetailPanelTemplateName/Index';

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
                            { id: 'Yaroslavl', title: 'Yaroslavl' },
                            { id: 'Moscow', title: 'Moscow' },
                            { id: 'Kazan', title: 'Kazan' },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    filterDescription: [
                        {
                            name: 'city',
                            value: 'Yaroslavl',
                            resetValue: null,
                            viewMode: 'frequent',
                            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                            editorOptions: {
                                source: new Memory({
                                    data: [
                                        { id: 'Yaroslavl', title: 'Yaroslavl' },
                                        { id: 'Moscow', title: 'Moscow' },
                                        { id: 'Kazan', title: 'Kazan' },
                                    ],
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                        },
                    ],
                    displayProperty: 'title',
                },
            },
        };
    }
}
