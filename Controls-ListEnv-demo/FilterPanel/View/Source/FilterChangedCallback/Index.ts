import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Source/FilterChangedCallback/Index';
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
                            caption: 'Отдел',
                            name: 'department',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            viewMode: 'basic',
                            editorOptions: {
                                keyProperty: 'id',
                                filter: {},
                                displayProperty: 'title',
                                source: new Memory({
                                    data: [
                                        { id: 'Разработка', title: 'Разработка' },
                                        { id: 'Продвижение', title: 'Продвижение' },
                                    ],
                                    keyProperty: 'id',
                                }),
                            },
                        },
                        {
                            name: 'owner',
                            resetValue: null,
                            value: null,
                            caption: '',
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            filterChangedCallback:
                                'Controls-ListEnv-demo/FilterPanel/View/Source/FilterChangedCallback/filterChangedCallback',
                            editorOptions: {
                                keyProperty: 'id',
                                filter: {},
                                displayProperty: 'title',
                                additionalTextProperty: 'counter',
                                source: new Memory({
                                    data: [
                                        {
                                            id: 'Новиков Д.В.',
                                            title: 'Новиков Д.В.',
                                            showOnAmountChanged: true,
                                            counter: 12,
                                            devCounter: 4,
                                        },
                                        {
                                            id: 'Кошелев А.Е.',
                                            title: 'Кошелев А.Е.',
                                            showOnAmountChanged: true,
                                            counter: 123,
                                            devCounter: 6,
                                        },
                                        {
                                            id: 'Субботин А.В.',
                                            title: 'Субботин А.В.',
                                            counter: 23,
                                            devCounter: 1,
                                        },
                                        {
                                            id: 'Чеперегин А.С.',
                                            title: 'Чеперегин А.С.',
                                            counter: 5,
                                            devCounter: 2,
                                        },
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
