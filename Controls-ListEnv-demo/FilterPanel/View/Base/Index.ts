import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Base/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = null;
    protected _filterSource: IFilterItem[] = null;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departments,
                        keyProperty: 'department',
                        filter,
                    }),
                    filterDescription: [
                        {
                            caption: 'Отдел',
                            name: 'department',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            editorTemplateName:
                                'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                keyProperty: 'department',
                                displayProperty: 'title',
                                source: new Memory({
                                    data: departments,
                                    keyProperty: 'department',
                                }),
                            },
                        },
                    ],
                    displayProperty: 'department',
                    keyProperty: 'department',
                },
            },
        };
    }
}
