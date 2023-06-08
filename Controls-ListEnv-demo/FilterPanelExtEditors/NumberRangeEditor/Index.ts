import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanelExtEditors/NumberRangeEditor/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const numberRangeConfig = {
    caption: 'Зар. плата',
    name: 'salary',
    editorTemplateName: 'Controls/filterPanelExtEditors:NumberRangeEditor',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        extendedCaption: 'Зар. плата',
    },
} as IFilterItem;

export const numberRangeBasicConfig = {
    caption: 'Зар. плата',
    name: 'salaryBasic',
    editorTemplateName: 'Controls/filterPanelExtEditors:NumberRangeEditor',
    resetValue: [],
    value: [20, 30],
    textValue: '',
    viewMode: 'basic',
    editorOptions: {
        extendedCaption: 'Зар. плата',
    },
} as IFilterItem;

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _gridColumns: object[] = [
        { displayProperty: 'title' },
        { displayProperty: 'salary' },
    ];

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            salary: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [numberRangeConfig],
                    source: new Memory({
                        data: departments,
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                },
            },
        };
    }
}
