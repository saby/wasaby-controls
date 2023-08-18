import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/ExpanderVisible/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const textConfig = {
    caption: '',
    expanderVisible: true,
    name: 'isDevelopment',
    editorTemplateName: 'Controls/filterPanel:TextEditor',
    resetValue: false,
    viewMode: 'basic',
    value: true,
    editorOptions: {
        filterValue: true,
        extendedCaption: 'Разработка',
    },
} as IFilterItem;

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _filterSource: IFilterItem[] = null;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [textConfig],
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
