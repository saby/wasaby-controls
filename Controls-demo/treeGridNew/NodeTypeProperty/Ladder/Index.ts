import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { dataForLadder } from '../data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/Ladder/Ladder';
import * as LadderCell from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/LadderCell';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return dataForLadder;
}

const columns: IGroupNodeColumn[] = [
    {
        width: '100px',
        displayProperty: 'date',
        stickyProperty: ['date'],
        template: LadderCell,
    },
    {
        width: '1fr',
        displayProperty: 'title',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IGroupNodeColumn[] = columns;
    protected _ladderProperties: string[] = ['date'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyLadder: {
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
                    expandedItems: [1, 7],
                    collapsedItems: [],
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    }

    protected _colspanCallback(
        item: Model,
        column: IGroupNodeColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        if (item.get('nodeType') === 'group' && columnIndex === 0) {
            return 'end';
        }
    }
}
