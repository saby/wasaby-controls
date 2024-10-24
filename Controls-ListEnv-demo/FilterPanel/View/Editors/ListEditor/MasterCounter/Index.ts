import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterCounter/Index';
import { Memory } from 'Types/source';
import * as onCounterClick from './OnCounterClick';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const filterItems = [
    { id: 1345, count: 15, title: 'Раздел', counterStyle: 'danger' },
    { id: 5, count: 67, title: 'Раздел' },
    { id: 7, title: 'Раздел' },
    { id: 4, count: 32, title: 'Раздел' },
];

export const listConfig = {
    name: 'owners',
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
        onCounterClick,
        additionalTextProperty: 'id',
        additionalTextTooltipProperty: 'id',
        mainCounterProperty: 'count',
        mainCounterTooltipProperty: 'count',
        mainCounterStyleProperty: 'counterStyle',
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            counterData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: filterItems,
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [listConfig],
                },
            },
        };
    }
}
