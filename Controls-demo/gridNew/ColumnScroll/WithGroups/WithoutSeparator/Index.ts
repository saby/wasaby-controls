import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';

import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/WithGroups/WithoutSeparator/WithoutSeparator';

const { getData } = Tasks;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        ...Tasks.getDefaultColumns(),
        {
            displayProperty: 'message',
            width: '150px',
        },
        {
            displayProperty: 'fullName',
            width: '150px',
        },
    ];
    protected _header: object[] = this._columns.map((c) => {
        return { caption: c.displayProperty };
    });

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
