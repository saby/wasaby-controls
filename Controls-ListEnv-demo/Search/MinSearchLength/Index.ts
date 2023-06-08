import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/Search/MinSearchLength/Index';
import * as filter from 'Controls-ListEnv-demo/Search/Input/Util/DataFilter';

export default class FlatList extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'Разработка' },
                            { id: 2, title: 'Продвижение СБИС' },
                            { id: 3, title: 'Федеральная клиентская служка' },
                        ],
                        filter,
                    }),
                    searchParam: 'title',
                    keyProperty: 'id',
                    displayProperty: 'title',
                    minSearchLength: 2,
                },
            },
        };
    }
}
