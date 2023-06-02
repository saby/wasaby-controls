import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ImageProperty/Index';
import { Memory } from 'Types/source';
import * as dataFilter from './DataFilter';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig(): unknown {
        return {
            department: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'department',
                    displayProperty: 'title',
                    source: new Memory({
                        data: departments,
                        keyProperty: 'department',
                        filter: dataFilter,
                    }),
                    filterButtonSource: [
                        {
                            caption: 'Отдел',
                            name: 'department',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            emptyKey: null,
                            emptyText: 'Все',
                            editorTemplateName:
                                'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                keyProperty: 'department',
                                displayProperty: 'title',
                                source: new Memory({
                                    data: departments,
                                    keyProperty: 'department',
                                }),
                                imageProperty: 'sourceImage',
                            },
                        },
                    ],
                },
            },
        };
    }
}
