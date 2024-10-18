import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { data } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/Base/Base';
import * as PriceColumnTemplate from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/PriceColumnTemplate';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

function getData() {
    return data;
}

export const columns: IGroupNodeColumn[] = [
    {
        width: '300px',
        displayProperty: 'title',
        groupNodeConfig: {
            textAlign: 'center',
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
    protected _columns: IGroupNodeColumn[] = columns;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyBase1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [],
                    collapsedItems: [],
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    }

    protected _colspanCallback(
        item: Model,
        column: IGroupNodeColumn,
        columnIndex: number
    ): TColspanCallbackResult {
        if (item.get('nodeType') === 'group' && columnIndex === 0) {
            return 3;
        }
        return 1;
    }
}
