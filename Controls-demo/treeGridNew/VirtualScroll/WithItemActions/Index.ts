import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';

import { VirtualScrollHasMore } from 'Controls-demo/treeGridNew/DemoHelpers/Data/VirtualScrollHasMore';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/WithItemActions/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[];
    protected _itemActions: IItemAction[] = getItemActions();

    protected _beforeMount(): void {
        this._columns = Flat.getColumns();
        this._columns[1].width = '50px';
        this._columns[2].width = '200px';

        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: VirtualScrollHasMore.getDataForVirtual(),
        });
    }
    protected _expandAll(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: VirtualScrollHasMore.getDataForVirtual(),
            filter: (): boolean => {
                return true;
            },
        });
    }
}
