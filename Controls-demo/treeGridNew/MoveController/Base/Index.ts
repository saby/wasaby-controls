import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { ItemActionsHelpers } from 'Controls/listDeprecate';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

import * as Template from 'wml!Controls-demo/treeGridNew/MoveController/Base/Base';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[];
    protected _itemActions: IItemAction[];
    protected _parentProperty: string = 'parent';
    protected _nodeProperty: string = 'type';

    private _items: RecordSet;

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '',
            },
        ];
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Flat.getData(),
            filter: (item, filter) => {
                const parent = filter.hasOwnProperty('parent')
                    ? filter.parent
                    : null;
                if (parent && parent.forEach) {
                    for (let i = 0; i < parent.length; i++) {
                        if (item.get('parent') === parent[i]) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return item.get('parent') === parent;
                }
            },
            parentProperty: this._parentProperty,
        });
        this._moveUpHandler = this._moveUpHandler.bind(this);
        this._moveDownHandler = this._moveDownHandler.bind(this);
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
        this._itemActionVisibilityCallback =
            this._itemActionVisibilityCallback.bind(this);
        this._itemActions = [
            {
                id: 'moveUp',
                icon: 'icon-ArrowUp',
                showType: TItemActionShowType.TOOLBAR,
                handler: this._moveUpHandler,
            },
            {
                id: 'moveDown',
                icon: 'icon-ArrowDown',
                showType: TItemActionShowType.TOOLBAR,
                handler: this._moveDownHandler,
            },
        ];
    }

    _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    protected _itemActionVisibilityCallback(
        action: IItemAction,
        item: Model
    ): boolean {
        let direction: string;
        let result = true;

        if (action.id === 'moveUp' || action.id === 'moveDown') {
            direction =
                action.id === 'moveUp'
                    ? ItemActionsHelpers.MOVE_DIRECTION.UP
                    : ItemActionsHelpers.MOVE_DIRECTION.DOWN;
            result = ItemActionsHelpers.reorderMoveActionsVisibility(
                direction,
                item,
                this._items,
                this._parentProperty,
                this._nodeProperty
            );
        }

        return result;
    }

    private _moveUpHandler(item: Model): void {
        this._children.treeGrid.moveItemUp(item.getKey()).then(() => {
            this._children.treeGrid.reload();
        });
    }

    private _moveDownHandler(item: Model): void {
        this._children.treeGrid.moveItemDown(item.getKey()).then(() => {
            this._children.treeGrid.reload();
        });
    }
}
