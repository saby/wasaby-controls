import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

import { data } from '../data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/WithMultiSelect/WithMultiSelect';
import * as PriceColumnTemplate from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/PriceColumnTemplate';
import 'css!Controls-demo/treeGridNew/NodeTypeProperty/WithMultiSelect/WithMultiSelect';

const columns: IGroupNodeColumn[] = [
    {
        width: '300px',
        displayProperty: 'title',
        groupNodeConfig: {
            textAlign: 'left',
            expanderAlign: 'right',
        },
    },
    {
        width: '100px',
        displayProperty: 'count',
        align: 'right',
    },
    {
        width: '100px',
        displayProperty: 'price',
        align: 'right',
        template: PriceColumnTemplate,
    },
    {
        width: '100px',
        displayProperty: 'price1',
        align: 'right',
        template: PriceColumnTemplate,
    },
    {
        width: '100px',
        displayProperty: 'price2',
        align: 'right',
        template: PriceColumnTemplate,
    },
    {
        width: '50px',
        displayProperty: 'tax',
        align: 'right',
    },
    {
        width: '100px',
        displayProperty: 'price3',
        align: 'right',
        template: PriceColumnTemplate,
        fontSize: 's',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _expandedItems: CrudEntityKey[] = [];
    protected _collapsedItems: CrudEntityKey[] = [];
    protected _columns: IGroupNodeColumn[] = columns;
    protected _itemActions: IItemAction[];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            parentProperty: 'parent',
            keyProperty: 'key',
            data,
        });
        this._itemActions = [
            {
                id: 'open',
                showType: TItemActionShowType.TOOLBAR,
                title: 'Открыть',
            },
        ];
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

    protected _itemActionVisibilityCallback(
        action: IItemAction,
        item: Model
    ): boolean {
        return item.get('nodeType') === 'group';
    }
}
