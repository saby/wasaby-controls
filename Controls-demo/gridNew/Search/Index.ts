import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Search/Search';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

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
            listData: {
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
