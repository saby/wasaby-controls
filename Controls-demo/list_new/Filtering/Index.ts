import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../DemoHelpers/DataCatalog';
import * as filter from './resources/DataFilter';
import * as Template from 'wml!Controls-demo/list_new/Filtering/ContextWrapper';
import 'css!DemoStand/Controls-demo';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            gadgets: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                        filter,
                    }),
                    filter: {
                        title: ['Notebooks', 'Tablets', 'Laptop computers'],
                    },
                    displayProperty: 'title',
                    keyProperty: 'key',
                },
            },
        };
    }
}
