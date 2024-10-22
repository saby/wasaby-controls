import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { dynamicParentData } from '../data/NodeTypePropertyData';
import { DynamicParentModelName } from './DynamicParentModel';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/DynamicParentProperty/DynamicParentProperty';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return dynamicParentData;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IGroupNodeColumn[] = [
        {
            displayProperty: 'title',
            width: '300px',
            groupNodeConfig: {
                textAlign: 'center',
            },
        },
        {
            displayProperty: 'count',
            width: '100px',
            align: 'right',
        },
        {
            displayProperty: 'price',
            width: '100px',
            align: 'right',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyDynamicParentProperty: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                        model: DynamicParentModelName,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'dynamicParent',
                    nodeProperty: 'type',
                    expandedItems: [null],
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    }

    protected _colspanCallback(item: Model): TColspanCallbackResult {
        if (typeof item === 'string' || item.get('nodeType') === 'group') {
            return 'end';
        }
        return 1;
    }
}
