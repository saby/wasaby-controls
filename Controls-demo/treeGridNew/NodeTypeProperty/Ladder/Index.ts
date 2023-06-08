import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { dataForLadder } from '../data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/Ladder/Ladder';
import * as LadderCell from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/LadderCell';

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
    protected _viewSource: HierarchicalMemory;
    protected _expandedItems: CrudEntityKey[] = [1, 7];
    protected _collapsedItems: CrudEntityKey[] = [];
    protected _columns: IGroupNodeColumn[] = columns;
    protected _ladderProperties: string[] = ['date'];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            parentProperty: 'parent',
            keyProperty: 'key',
            data: dataForLadder,
        });
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
