import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

import { data } from '../data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/WithMultiSelect/WithMultiSelect';
import * as PriceColumnTemplate from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/PriceColumnTemplate';
import 'css!Controls-demo/treeGridNew/NodeTypeProperty/WithMultiSelect/WithMultiSelect';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

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

function getData() {
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IGroupNodeColumn[] = columns;
    protected _itemActions: IItemAction[];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyWithMultiSelect: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [],
                    collapsedItems: [],
                    multiSelectVisibility: 'visible',
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    }

    protected _beforeMount(): void {
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

    protected _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
        return item.get('nodeType') === 'group';
    }
}
