import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/ResultsPosition/Bottom/Bottom';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IItemAction } from 'Controls/interface';
import {
    getActionsForContacts as getItemActions,
    getMoreActions,
} from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths(false);

    protected _itemActions: IItemAction[] = [
        ...getItemActions(),
        ...getMoreActions(),
    ];
    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData(),
        });
        this._columns[1].width = '224px';
    }
}
