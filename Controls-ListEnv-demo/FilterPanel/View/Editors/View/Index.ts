import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/View/Index';
import * as stackTemplate from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/MultiSelectStackTemplate/StackTemplate';
import { Memory } from 'Types/source';
import {
    departmentsWithAmount,
    filterItems,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _stackTemplate: TemplateFunction = stackTemplate;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            viewData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departmentsWithAmount,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: {
                            pageSize: 20,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    filterDescription: [
                        {
                            caption: 'Количество сотрудников',
                            name: 'amount',
                            editorTemplateName:
                                'Controls/filterPanelExtEditors:NumberRangeEditor',
                            resetValue: [],
                            value: [],
                            textValue: '',
                            viewMode: 'basic',
                            editorOptions: {
                                afterEditorTemplate:
                                    'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/SelectorTemplate/AfterEditorTemplate',
                            },
                        },
                        {
                            name: 'owner',
                            caption: '',
                            resetValue: [],
                            value: [],
                            expanderVisible: true,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                imageProperty: 'sourceImage',
                                multiSelect: true,
                                navigation: {
                                    source: 'page',
                                    view: 'page',
                                    sourceConfig: {
                                        pageSize: 3,
                                        page: 0,
                                        hasMore: false,
                                    },
                                },
                                keyProperty: 'owner',
                                additionalTextProperty: 'id',
                                displayProperty: 'title',
                                selectorTemplate: {
                                    templateName:
                                        'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/MultiSelectStackTemplate/StackTemplate',
                                    templateOptions: { items: filterItems },
                                    popupOptions: {
                                        width: 500,
                                    },
                                },
                                source: new Memory({
                                    data: filterItems,
                                    keyProperty: 'owner',
                                }),
                            },
                        },
                    ],
                },
            },
        };
    }
}
