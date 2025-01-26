import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { listData, cityFilterData } from 'Controls-ListEnv-demo/Filter/resources/Data';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/FrequentFilter/Chips/Index';
import 'Controls/filter';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

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
                            name: 'name',
                            group: 'Имя',
                            value: [],
                            resetValue: [],
                            viewMode: 'basic',
                            textValue: '',
                        },
                        {
                            name: 'city',
                            group: 'Город',
                            value: '',
                            resetValue: [],
                            viewMode: 'basic',
                            textValue: '',
                            editorOptions: {
                                displayProperty: 'caption',
                                items: new RecordSet({
                                    rawData: cityFilterData.map((item, index) => {
                                        return {
                                            id: item.city,
                                            caption: item.city,
                                        };
                                    }),
                                    keyProperty: 'id',
                                }),
                            },
                        },
                    ],
                    source: new Memory({
                        data: listData,
                        keyProperty: 'id',
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
