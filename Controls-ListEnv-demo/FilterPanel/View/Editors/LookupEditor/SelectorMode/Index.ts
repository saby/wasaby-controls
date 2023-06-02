import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/SelectorMode/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';
import * as filter from './DataFilter';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';

const data = [
    { id: 'Yaroslavl', title: 'Yaroslavl' },
    { id: 'Moscow', title: 'Moscow' },
    { id: 'Kazan', title: 'Kazan' },
    { id: 'Rostov', title: 'Rostov' },
    { id: 'Saint Petersburg', title: 'Saint Petersburg' },
    { id: 'Anapa', title: 'Anapa' },
    { id: 'Belgorod', title: 'Belgorod' },
    { id: 'Veliky Novgorod', title: 'Veliky Novgorod' },
];

export const lookupConfig = {
    name: 'city',
    editorTemplateName: 'Controls/filterPanel:LookupEditor',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Город',
        selectorTemplate: {
            mode: 'dialog',
            multiSelect: true,
            templateName:
                'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/DialogTemplate',
            templateOptions: {
                items: data,
            },
        },
        multiSelect: true,
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            lookupData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    root: null,
                    filterDescription: [lookupConfig],
                },
            },
        };
    }
}
