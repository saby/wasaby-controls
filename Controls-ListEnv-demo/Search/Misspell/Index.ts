import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Search/Misspell/Index';
import SearchMemory from 'Controls-ListEnv-demo/Search/Misspell/SearchMemory';
import * as filter from 'Controls-ListEnv-demo/Search/Misspell/DataFilter';
import 'css!Controls-ListEnv-demo/Search/Index';

export default class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig(): unknown {
        return {
            nomenclature: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new SearchMemory({
                        keyProperty: 'id',
                        // @ts-ignore
                        filter,
                        data: [
                            { id: 1, title: 'Москва' },
                            { id: 2, title: 'Ярославль' },
                            { id: 3, title: 'Казань' },
                        ],
                        searchParam: 'title',
                    }),
                    searchParam: 'title',
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
        };
    }
}
