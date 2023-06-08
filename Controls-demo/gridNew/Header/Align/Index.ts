import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Align/Align';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 5);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = [
        {
            title: '# (default)',
        },
        {
            title: 'Страна (left)',
            align: 'left',
        },
        {
            title: 'Столица (center)',
            align: 'center',
        },
        {
            title: 'Население (right)',
            align: 'right',
        },
    ];
    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '100px',
        },
        {
            displayProperty: 'country',
            width: '200px',
        },
        {
            displayProperty: 'capital',
            width: '150px',
            compatibleWidth: '98px',
        },
        {
            displayProperty: 'population',
            width: '150px',
            compatibleWidth: '118px',
        },
    ];

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
