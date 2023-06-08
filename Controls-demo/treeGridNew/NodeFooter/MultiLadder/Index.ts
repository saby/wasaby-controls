import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, DataSet, HierarchicalMemory, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IGroupNodeColumn } from 'Controls/treeGrid';
import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';

import { dataForLadder } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/MultiLadder/MultiLadder';
import * as LadderCell from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/LadderCell';

const columns: IGroupNodeColumn[] = [
    {
        width: '100px',
        displayProperty: 'date',
        stickyProperty: ['date', 'parent'],
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
    protected _columns: IGroupNodeColumn[] = columns;
    protected _ladderProperties: string[] = ['date'];

    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        source: 'page',
        view: 'demand',
        sourceConfig: {
            pageSize: 3,
            page: 0,
            hasMore: true,
            multiNavigation: true,
        },
    };

    protected _beforeMount(): void {
        this._viewSource = new MyHierarchicalMemory({
            parentProperty: 'parent',
            keyProperty: 'key',
            data: dataForLadder,
        });
    }
}

export class MyHierarchicalMemory extends HierarchicalMemory {
    query(query?: Query): Promise<DataSet> {
        const parentProperty = this._$parentProperty;
        const where = query.getWhere();
        const parents: CrudEntityKey[] = where[parentProperty];
        const keyProperty = this._keyProperty;
        const limit = query.getLimit();
        const position = where[keyProperty + '>='] || 0;

        const items = [];
        const hasMore = [];
        parents.forEach((parent) => {
            const itemsWithParent: object[] = this.data.filter((item) => {
                return item[parentProperty] === parent;
            });
            hasMore.push({
                id: parent,
                nav_result: position + limit < itemsWithParent.length,
            });
            const itemsWithParentWithLimit = itemsWithParent.slice(position, limit);
            items.push(...itemsWithParentWithLimit);
        });

        const meta = {
            more: new RecordSet({ keyProperty: 'id', rawData: hasMore }),
        };
        const data = new DataSet({
            keyProperty,
            itemsProperty: 'items',
            metaProperty: 'meta',
            rawData: { items, meta },
        });

        return Promise.resolve(data);
    }
}
