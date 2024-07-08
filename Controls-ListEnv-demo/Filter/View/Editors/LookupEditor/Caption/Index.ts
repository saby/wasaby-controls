import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import * as filter from '../resources/DataFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/Caption/Index';

const data = [
    { id: 'Yaroslavl', title: 'Yaroslavl' },
    { id: 'Moscow', title: 'Moscow' },
    { id: 'Kazan', title: 'Kazan' },
];

export const lookupConfig = {
    name: 'city',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    resetValue: 1,
    value: 1,
    emptyText: 'Пустое значение',
    emptyKey: 1,
    textValue: '',
    viewMode: 'basic',
    editorOptions: {
        caption: 'Все города',
        source: new Memory({
            keyProperty: 'id',
            data,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: data,
            },
        },
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig() {
        return {
            cities: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data,
                        keyProperty: 'id',
                        filter,
                    }),
                    filterDescription: [lookupConfig],
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
        };
    }
}
