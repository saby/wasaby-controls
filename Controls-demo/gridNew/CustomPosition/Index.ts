import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/CustomPosition/CustomPosition';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import * as cellTemplate from 'wml!Controls-demo/gridNew/CustomPosition/CellTemplate';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 7);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _selectedKeys: number[] = [0, 2];
    private _columns: IColumn[] = [
        { displayProperty: 'number', width: '50px' },
        { displayProperty: 'country', width: '200px' },
        { displayProperty: 'capital', width: '100px' },
        { width: '50px', template: cellTemplate },
        { displayProperty: 'population', width: '150px' },
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
                    selectedKeys: [0, 2],
                },
            },
        };
    }
}
