import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { extendedData } from '../data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/ChildNodes/ChildNodes';
import * as PriceColumnTemplate from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/PriceColumnTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return extendedData;
}

const columns: IGroupNodeColumn[] = [
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
            NodeTypePropertyChildNodes: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
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
        if (typeof item === 'string') {
            return 'end';
        }
        if (item.get('nodeType') === 'group' && columnIndex === 0) {
            return 3;
        }
        return 1;
    }
}
