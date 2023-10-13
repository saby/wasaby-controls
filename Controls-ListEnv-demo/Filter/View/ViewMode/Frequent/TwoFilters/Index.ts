import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/TwoFilters/Index';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            filtersData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            { id: 'Yaroslavl', title: 'Yaroslavl' },
                            { id: 'Moscow', title: 'Moscow' },
                            { id: 'Kazan', title: 'Kazan' },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            name: 'city',
                            value: 'Yaroslavl',
                            resetValue: null,
                            textValue: '',
                            viewMode: 'frequent',
                            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                            editorOptions: {
                                source: new Memory({
                                    data: [
                                        { id: 'Yaroslavl', title: 'Yaroslavl' },
                                        { id: 'Moscow', title: 'Moscow' },
                                        { id: 'Kazan', title: 'Kazan' },
                                    ],
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                        },
                        {
                            name: 'resp',
                            value: 'Новиков Д.В.',
                            resetValue: null,
                            viewMode: 'frequent',
                            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                                        { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                                        { id: 'Субботин А.В.', title: 'Субботин А.В.' },
                                    ],
                                }),
                                displayProperty: 'title',
                                extendedCaption: 'Должность',
                                keyProperty: 'id',
                            },
                        },
                    ],
                },
            },
        };
    }
}
