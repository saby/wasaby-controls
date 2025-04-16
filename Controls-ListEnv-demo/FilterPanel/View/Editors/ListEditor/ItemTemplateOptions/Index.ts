import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ItemTemplateOptions/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    static getLoadConfig() {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [
                        {
                            caption: 'Отдел',
                            name: 'department',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                keyProperty: 'department',
                                displayProperty: 'title',
                                source: new Memory({
                                    data: departments,
                                    keyProperty: 'department',
                                }),
                                itemTemplateOptions: {
                                    backgroundColorStyle: 'success',
                                    fontColorStyle: 'success',
                                },
                                mainCounterProperty: 'id',
                            },
                        },
                    ],
                },
            },
        };
    }
}
