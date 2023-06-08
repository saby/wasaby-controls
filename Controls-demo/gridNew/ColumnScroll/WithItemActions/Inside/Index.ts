import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/WithItemActions/Inside/Inside';
import { Memory } from 'Types/source';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[] = getItemActions();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _header: IHeaderCell[] = Countries.getHeader();

    protected _beforeMount(): void {
        this._columns[5].compatibleWidth = '175px';
        const data = Countries.getData();
        // eslint-disable-next-line
        const country = data[2].country;
        // eslint-disable-next-line
        data[2].country = `${country} ${country} ${country} ${country} ${country} ${country}`;

        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }
}
