import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/FrequentItemsWithHistory/Index';

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
                                id: '1',
                                title: 'Платформа',
                            },
                            {
                                id: '2',
                                title: 'ЭДО',
                            },
                            {
                                id: '3',
                                title: 'Филиал "Григоровский" дочернего предприятия "Агрофирма Шахтер"',
                            },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    filterDescription: [
                        {
                            name: 'department',
                            value: ['3'],
                            resetValue: [],
                            viewMode: 'frequent',
                            textValue: '',
                            editorOptions: {
                                keyProperty: 'id',
                                emptyText: 'Все подразделения',
                                displayProperty: 'title',
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        {
                                            id: '1',
                                            title: 'Платформа',
                                        },
                                        {
                                            id: '2',
                                            title: 'ЭДО',
                                        },
                                        {
                                            id: '3',
                                            title: 'Филиал "Григоровский" дочернего предприятия "Агрофирма Шахтер"',
                                        },
                                    ],
                                }),
                            },
                        },
                    ],
                    displayProperty: 'title',
                },
            },
        };
    }
}
