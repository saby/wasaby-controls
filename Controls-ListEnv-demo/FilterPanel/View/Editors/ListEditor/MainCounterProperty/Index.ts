import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MainCounterProperty/Index';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const filterItems = [
    { id: 1, count: 2, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
    { id: 2, count: 3, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
    { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
    { id: 4, count: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
];

export const listConfig = {
    name: 'owners',
    caption: 'Руководители',
    resetValue: null,
    value: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    editorOptions: {
        style: 'master',
        keyProperty: 'id',
        displayProperty: 'title',
        source: new Memory({
            data: filterItems,
            keyProperty: 'id',
        }),
        additionalTextProperty: 'id',
        mainCounterProperty: 'count',
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            counterData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: filterItems,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [listConfig],
                },
            },
        };
    }
}
