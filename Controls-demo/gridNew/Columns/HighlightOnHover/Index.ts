import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/HighlightOnHover/HighlightOnHover';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().splice(0, 5);
}

const columns: IColumn[] = [
    {
        displayProperty: 'number',
        width: '30px',
    },
    {
        displayProperty: 'country',
        width: '200px',
        hoverBackgroundStyle: 'transparent',
    },
    {
        displayProperty: 'capital',
        width: '100px',
        hoverBackgroundStyle: 'transparent',
    },
    {
        displayProperty: 'population',
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
];

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
                },
            },
        };
    }
}
