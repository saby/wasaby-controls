import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Source/FilterVisibilityCallback/Index';
import { Memory } from 'Types/source';
import { departmentsWithAmount } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            callbackData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departmentsWithAmount,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            caption: 'Количество сотрудников',
                            name: 'amount',
                            editorTemplateName: 'Controls/filterPanelExtEditors:NumberRangeEditor',
                            resetValue: [],
                            value: [],
                            textValue: '',
                        },
                        {
                            name: 'owner',
                            resetValue: [],
                            value: [],
                            caption: '',
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            filterVisibilityCallback:
                                'Controls-ListEnv-demo/FilterPanel/View/Source/FilterVisibilityCallback/FilterVisibilityCallback',
                            editorOptions: {
                                keyProperty: 'id',
                                filter: {},
                                displayProperty: 'title',
                                source: new Memory({
                                    data: [
                                        { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                                        { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                                        { id: 'Субботин А.В.', title: 'Субботин А.В.' },
                                        { id: 'Чеперегин А.С.', title: 'Чеперегин А.С.' },
                                    ],
                                    keyProperty: 'id',
                                }),
                            },
                        },
                    ],
                },
            },
        };
    }
}
