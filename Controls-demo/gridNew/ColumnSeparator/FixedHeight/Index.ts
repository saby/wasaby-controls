import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnSeparator/FixedHeight/FixedHeight';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const LASTITEM = 5;
const FIRSTITEM = 2;

function getData() {
    return Countries.getData().splice(0, LASTITEM);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Countries.getHeader().slice(FIRSTITEM, LASTITEM);

    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths().slice(
        FIRSTITEM,
        LASTITEM
    );

    protected _rowSeparator1: boolean = false;
    protected _columnSeparator1: boolean = false;

    protected _rowSeparator2: boolean = true;
    protected _columnSeparator2: boolean = false;

    protected _rowSeparator3: boolean = true;
    protected _columnSeparator3: boolean = false;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
