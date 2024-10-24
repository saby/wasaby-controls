import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { IFilterItem } from 'Controls/filter';
import * as filter from './resources/DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/CompositeFilter/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const textConfig = {
    caption: '',
    name: 'isDevelopment',
    editorTemplateName: 'Controls/filterPanelEditors:Boolean',
    resetValue: false,
    viewMode: 'extended',
    value: false,
    editorOptions: {
        filterValue: true,
        extendedCaption: 'Разработка',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _gridColumns: object[] = [{ displayProperty: 'title' }];

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [
                        {
                            caption: 'Разработка',
                            name: 'isDevelopment',
                            editorTemplateName:
                                'Controls-ListEnv-demo/FilterPanel/View/Editors/CompositeFilter/resources/CheckboxEditor',
                            resetValue: false,
                            value: true,
                            textValue: '',
                            editorOptions: {
                                caption: 'Разработка',
                            },
                        },
                    ],
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
