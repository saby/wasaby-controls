import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IColumn } from 'Controls/grid';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { ItemActionsHelpers } from 'Controls/listDeprecate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import DemoSource from './DemoSource';

import * as Template from 'wml!Controls-demo/treeGridNew/MoveController/Base/Base';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    protected _itemActions: IItemAction[];

    private _items: RecordSet;

    _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '',
            },
        ];

        this._moveUpHandler = this._moveUpHandler.bind(this);
        this._moveDownHandler = this._moveDownHandler.bind(this);
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
        this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
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

    protected _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
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
                'parent',
                'type'
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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MoveControllerBase: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new DemoSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
