import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const dropdownConfig = {
    caption: 'Отдел',
    name: 'department',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            data: departments,
            keyProperty: 'department',
        }),
        extendedCaption: 'Отдел',
        displayProperty: 'title',
        keyProperty: 'department',
    },
} as IFilterItem;

export const dropdownBasicConfig = {
    ...dropdownConfig,
    ...{
        viewMode: 'basic',
        value: 1,
    },
} as IFilterItem;

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [dropdownConfig],
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
