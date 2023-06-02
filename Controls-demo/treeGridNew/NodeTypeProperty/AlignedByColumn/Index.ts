import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { data } from '../data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/AlignedByColumn/AlignedByColumn';

const columns: IGroupNodeColumn[] = [
    {
        width: '300px',
        displayProperty: 'title',
        groupNodeConfig: {
            textAlign: 'right',
            iconStyle: 'secondary',
            textTransform: 'uppercase',
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
        displayType: 'money',
        groupNodeConfig: {
            textVisible: false,
        },
    },
    {
        width: '100px',
        displayProperty: 'price1',
        align: 'right',
        displayType: 'money',
    },
    {
        width: '100px',
        displayProperty: 'price2',
        align: 'right',
        displayType: 'money',
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
        displayType: 'money',
        fontSize: 's',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _expandedItems: CrudEntityKey[] = [null];
    protected _collapsedItems: CrudEntityKey[] = [];
    protected _columns: IGroupNodeColumn[] = columns;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            parentProperty: 'parent',
            keyProperty: 'key',
            data,
            filter: (): boolean => {
                return true;
            },
        });
    }

    protected _colspanCallback(
        item: Model,
        column: IGroupNodeColumn,
        columnIndex: number
    ): TColspanCallbackResult {
        if (item.get('nodeType') === 'group' && columnIndex === 0) {
            return 2;
        }
        return 1;
    }
}
