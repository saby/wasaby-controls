import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/Navigation/Index';
import * as stackTemplate from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/MultiSelectStackTemplate/StackTemplate';
import { Memory } from 'Types/source';
import { departmentsWithAmount } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const filterItems = [
    { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
    { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
    { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
    { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _stackTemplate: TemplateFunction = stackTemplate;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            selectorData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departmentsWithAmount,
                        keyProperty: 'id',
                        filter,
                    }),
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: {
                            pageSize: 20,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            caption: 'Ответственный',
                            name: 'owner',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                navigation: {
                                    source: 'page',
                                    view: 'cut',
                                    sourceConfig: {
                                        pageSize: 2,
                                        hasMore: false,
                                        page: 0,
                                    },
                                },
                                keyProperty: 'owner',
                                additionalTextProperty: 'id',
                                displayProperty: 'title',
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
