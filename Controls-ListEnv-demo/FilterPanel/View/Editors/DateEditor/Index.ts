import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/DateEditor/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const dateConfig = {
    caption: 'Дата',
    name: 'dateEditor',
    editorTemplateName: 'Controls/filterPanelEditors:Date',
    resetValue: null,
    viewMode: 'extended',
    value: null,
    textValue: '',
    editorOptions: {
        closeButtonVisibility: 'hidden',
        extendedCaption: 'Дата',
    },
} as IFilterItem;

export const dateBasicConfig = {
    ...dateConfig,
    ...{
        viewMode: 'basic',
        // eslint-disable-next-line no-magic-numbers
        value: new Date(2022, 0, 1),
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
                    filterDescription: [dateConfig],
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
