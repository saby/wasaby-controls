import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as filter from '../Util/DataFilter';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/Search/Lists/ExtraValues';
import 'css!Controls-ListEnv-demo/Search/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            search: {
                dataFactoryName: 'Controls-ListEnv/searchDataFactory:Factory',
                dataFactoryArguments: {},
            },
            list1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    loaderExtraValues: {
                        searchValue: ['search', 'searchValue'],
                    },
                    sliceExtraValues: {
                        searchValue: ['search', 'searchValue'],
                    },
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            {
                                id: 1,
                                title: 'Разработка',
                            },
                            {
                                id: 2,
                                title: 'Продвижение СБИС',
                            },
                            {
                                id: 3,
                                title: 'Федеральная клиентская служба',
                            },
                        ],
                        filter,
                    }),
                    searchParam: 'title',
                    keyProperty: 'id',
                    displayProperty: 'title',
                },
            },
            list2: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    loaderExtraValues: {
                        searchValue: ['search', 'searchValue'],
                    },
                    sliceExtraValues: {
                        searchValue: ['search', 'searchValue'],
                    },
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            {
                                id: 4,
                                title: 'Служба эксплуатации',
                            },
                            {
                                id: 5,
                                title: 'Технологии и маркетинг',
                            },
                            {
                                id: 6,
                                title: 'Федеральный центр продаж',
                            },
                        ],
                        filter,
                    }),
                    searchParam: 'title',
                    keyProperty: 'id',
                    displayProperty: 'title',
                },
            },
        };
    }
}
