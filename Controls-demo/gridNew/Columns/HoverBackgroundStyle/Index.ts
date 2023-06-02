import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';

import { getActionsForContacts } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { Data } from 'Controls-demo/gridNew/Columns/HoverBackgroundStyle/Data';

import * as Template from 'wml!Controls-demo/gridNew/Columns/HoverBackgroundStyle/HoverBackgroundStyle';

/**
 * Используется для статьи https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/background/#hover
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Data.getColumns();
    protected _itemActions: IItemAction[] = getActionsForContacts();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Data.getData(),
        });
    }
}
