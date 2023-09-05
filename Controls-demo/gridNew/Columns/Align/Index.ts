import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/Align/Align';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 5);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '40px',
            align: 'right',
        },
        {
            displayProperty: 'country',
            width: '300px',
            align: 'center',
        },
        {
            displayProperty: 'capital',
            width: '1fr',
            align: 'left',
        },
        {
            displayProperty: 'population',
            width: '150px',
            align: 'right',
        },
        {
            displayProperty: 'square',
            width: '150px',
            align: 'left',
        },
        {
            displayProperty: 'populationDensity',
            width: 'max-content',
            compatibleWidth: '60px',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsAlign: {
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
