import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/DateRangeEditor/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const dateRangeConfig = {
    caption: 'Период',
    name: 'dateRangeEditor',
    editorTemplateName: 'Controls/filterPanelEditors:DateRange',
    resetValue: [],
    viewMode: 'extended',
    value: [],
    textValue: '',
    editorOptions: {
        extendedCaption: 'Период',
    },
} as IFilterItem;

export const dateRangeBasicConfig = {
    ...dateRangeConfig,
    ...{
        viewMode: 'basic',
        // eslint-disable-next-line no-magic-numbers
        value: [new Date(2020, 0, 1), new Date(2022, 0, 1)],
    },
} as IFilterItem;

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            dates: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [dateRangeConfig],
                    source: new Memory({
                        data: departments,
                        keyProperty: 'department',
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                },
            },
        };
    }
}
