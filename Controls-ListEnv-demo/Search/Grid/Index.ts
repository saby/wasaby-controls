import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Countries } from 'Controls-ListEnv-demo/Search/Grid/Countries';
import * as Template from 'wml!Controls-ListEnv-demo/Search/Grid/Search';

const columns: IColumn[] = [
    {
        displayProperty: 'number',
        width: '34px',
    },
    {
        displayProperty: 'country',
        width: '200px',
    },
    {
        displayProperty: 'capital',
        width: '100px',
    },
    {
        displayProperty: 'population',
        displayType: 'number',
        width: '150px',
    },
    {
        displayProperty: 'square',
        width: '100px',
    },
    {
        displayProperty: 'populationDensity',
        width: '120px',
    },
    {
        displayType: 'date',
        displayProperty: 'date',
        displayTypeOptions: {
            format: "DD MMM'YY HH:mm",
        },
    },
    {
        displayType: 'money',
        displayProperty: 'gdp',
    },
    {
        displayProperty: 'currency',
    },
];

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = columns;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Search: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    minSearchLength: 3,
                    searchParam: 'country',
                },
            },
        };
    }
}
