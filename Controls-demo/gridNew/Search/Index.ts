import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Search/Search';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

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

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = columns;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData(),
        });
    }
}
