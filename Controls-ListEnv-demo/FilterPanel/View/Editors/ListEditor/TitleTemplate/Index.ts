import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/TitleTemplate/Index';
import 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/TitleTemplate/TitleTemplate';
import { Memory } from 'Types/source';
import { departmentsWithAmount } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/TitleTemplate/index';

const filterItems = [
    { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
    { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
    { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
    { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
    { id: 5, title: 'Всего', owner: 'Всего' },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            titleData: {
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
                            caption: 'Ответственные',
                            name: 'owners',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                titleTemplate:
                                    'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/TitleTemplate/TitleTemplate',
                                keyProperty: 'owner',
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
