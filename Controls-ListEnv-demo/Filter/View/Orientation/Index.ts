import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import 'Controls-ListEnv-demo/Filter/View/HistoryId/HistorySourceDemo';
import * as filter from '../HistoryId/DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Orientation/Index';

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
                    filterDescription: [
                        {
                            name: 'city',
                            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                            resetValue: null,
                            value: 1,
                            viewMode: 'basic',
                            textValue: '',
                            editorOptions: {
                                source: new Memory({
                                    data: [
                                        { id: 1, title: 'Yaroslavl' },
                                        { id: 2, title: 'Moscow' },
                                        { id: 3, title: 'Kazan' },
                                    ],
                                    keyProperty: 'id',
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                                extendedCaption: 'Город',
                            },
                        },
                    ],
                    source: new Memory({
                        data: [
                            { id: 1, title: 'Yaroslavl' },
                            { id: 2, title: 'Moscow' },
                            { id: 3, title: 'Kazan' },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    viewMode: 'list',
                    displayProperty: 'title',
                    historyId: 'Orientation__HistoryId',
                },
            },
        };
    }
}
