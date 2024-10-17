import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as filter from '../resources/DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/SearchParam/Index';
import SearchMemory from './SearchMemory';
import * as SearchFilter from 'Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/SearchParam/SearchFilter';

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
                            { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                            { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                            { id: 'Субботин А.В.', title: 'Субботин А.В.' },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    filterDescription: [
                        {
                            name: 'response',
                            value: null,
                            resetValue: null,
                            editorOptions: {
                                searchParam: 'title',
                                useListRender: true,
                                source: new SearchMemory({
                                    keyProperty: 'key',
                                    data: [
                                        { key: 1, title: 'admin.sbis.ru' },
                                        { key: 2, title: 'booking.sbis.ru' },
                                        { key: 3, title: 'ca.sbis.ru' },
                                        { key: 4, title: 'ca.tensor.ru' },
                                        { key: 5, title: 'cloud.sbis.ru' },
                                        { key: 6, title: 'consultant.sbis.ru' },
                                        { key: 7, title: 'explain.sbis.ru' },
                                        { key: 8, title: 'genie.sbis.ru' },
                                        { key: 9, title: 'my.sbis.ru' },
                                        { key: 10, title: 'ofd.sbis.ru' },
                                        { key: 11, title: 'online.sbis.ru' },
                                        { key: 12, title: 'presto-offline' },
                                        { key: 13, title: 'retail-offline' },
                                        { key: 14, title: 'sbis.ru' },
                                        { key: 15, title: 'tensor.ru' },
                                        { key: 16, title: 'wi.sbis.ru' },
                                        { key: 17, title: 'dev-online.sbis.ru' },
                                        { key: 18, title: 'fix-online.sbis.ru' },
                                        { key: 19, title: 'fix-cloud.sbis.ru' },
                                        { key: 20, title: 'rc-online.sbis.ru' },
                                        { key: 21, title: 'pre-test-online.sbis.ru' },
                                        { key: 22, title: 'test-online.sbis.ru' },
                                    ],
                                    filter: SearchFilter,
                                }),
                                displayProperty: 'title',
                                keyProperty: 'key',
                            },
                            viewMode: 'frequent',
                        },
                    ],
                    displayProperty: 'title',
                },
            },
        };
    }
    static _styles: string[] = ['DemoStand/Controls-demo'];
}
