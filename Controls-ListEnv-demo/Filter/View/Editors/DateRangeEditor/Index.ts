import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateRangeEditor/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig() {
        return {
            delivery: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [
                        {
                            caption: 'Срок',
                            name: 'dateEditorTerm',
                            editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
                            resetValue: [],
                            viewMode: 'basic',
                            value: [],
                            editorOptions: {
                                emptyCaption: 'Бессрочно',
                            },
                        },
                        {
                            caption: 'Период',
                            name: 'dateEditor',
                            editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
                            resetValue: [],
                            viewMode: 'extended',
                            value: [],
                            editorOptions: {
                                extendedCaption: 'Дата',
                            },
                        },
                        {
                            caption: 'Период доставки',
                            name: 'dateEditorTo',
                            editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
                            resetValue: [],
                            viewMode: 'extended',
                            value: [],
                            editorOptions: {
                                datePopupType: 'shortDatePicker',
                                extendedCaption: 'Период доставки',
                            },
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
