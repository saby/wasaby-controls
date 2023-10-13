import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateRangeValidation/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            periods: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [
                        {
                            name: 'date',
                            value: null,
                            type: 'dateRange',
                            itemTemplate:
                                'wml!Controls-ListEnv-demo/Filter/View/Editors/DateRangeValidation/resources/DateRange',
                            validators: [
                                'Controls-ListEnv-demo/Filter/View/Editors/DateRangeValidation/Validator:Validator.dateRange',
                            ],
                            editorOptions: {
                                _date: new Date(2022, 0, 30),
                                _displayDate: new Date(2022, 0, 30),
                                emptyCaption: 'Весь период',
                                editorMode: 'Selector',
                                chooseHalfyears: true,
                                chooseYears: true,
                                resetStartValue: null,
                                resetEndValue: null,
                            },
                            viewMode: 'basic',
                        },
                    ],
                    source: new Memory({
                        data: [],
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                    viewMode: 'list',
                },
            },
        };
    }
}
