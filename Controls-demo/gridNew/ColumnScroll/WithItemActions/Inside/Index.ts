import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/WithItemActions/Inside/Inside';
import { Memory } from 'Types/source';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    const data = Countries.getData();
    // eslint-disable-next-line
    const country = data[2].country;
    // eslint-disable-next-line
    data[2].country = `${country} ${country} ${country} ${country} ${country} ${country}`;
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _header: IHeaderCell[] = Countries.getHeader();

    protected _beforeMount(): void {
        this._columns[5].compatibleWidth = '175px';
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScrollWithItemActionsInside: {
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
