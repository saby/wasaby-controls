import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/FilterChangedCallback/Index';
import { Memory } from 'Types/source';
import { tumblerConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TumblerEditor/Index';
import { lookupConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import * as filter from './DataFilter';

const lookupEditor = {
    ...lookupConfig,
    ...{
        filterChangedCallback:
            'Controls-ListEnv-demo/Filter/View/FilterChangedCallback/filterChangedCallback',
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'owner',
        },
        {
            displayProperty: 'city',
        },
    ];
    protected _header: IHeaderCell[] = [{ caption: 'Руководитель' }, { caption: 'Город' }];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            filterData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                    root: null,
                    filterDescription: [tumblerConfig, lookupEditor],
                },
            },
        };
    }
}
