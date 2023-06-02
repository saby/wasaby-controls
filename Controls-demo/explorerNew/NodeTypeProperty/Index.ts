import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { IItemAction } from 'Controls/interface';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { columns, data } from './data/NodeTypePropertyData';
import { memoryFilter } from 'Controls-demo/treeGridNew/DemoHelpers/Filter/memoryFilter';

import * as Template from 'wml!Controls-demo/explorerNew/NodeTypeProperty/NodeTypeProperty';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = columns;
    protected _root: CrudEntityKey = null;
    protected _expandedItems: CrudEntityKey[] = [1, 2, 3];
    protected _collapsedItems: CrudEntityKey[] = [];

    protected _itemActions: IItemAction[] = [
        {
            id: 0,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete pls',
            showType: 0,
            handler: (item) => {
                this._children.explorerView.removeItems({
                    selectedKeys: [item.getKey()],
                    excludedKeys: [],
                });
            },
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data,
            filter: memoryFilter,
        });
    }

    protected _colspanCallback(
        item: Model,
        column: IGroupNodeColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        if (item.get('nodeType') === 'group' && columnIndex === 0) {
            return 3;
        }
        return 1;
    }
}
