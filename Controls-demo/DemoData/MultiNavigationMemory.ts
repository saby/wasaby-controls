import { CrudEntityKey, DataSet, HierarchicalMemory, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';

export default class MultiNavigationMemory extends HierarchicalMemory {
    _moduleName: string = 'Controls-demo/DemoData/MultiNavigationMemory';

    query(query?: Query): Promise<DataSet> {
        const parentProperty = this._$parentProperty;
        const keyProperty = this._keyProperty;
        const where = query.getWhere();
        const parents: CrudEntityKey[] = where[parentProperty]?.length
            ? where[parentProperty]
            : [where[parentProperty]];

        const items = [];
        const hasMore = [];
        parents.forEach((parent) => {
            const nodeQuery =
                query.getUnion().find((q) => {
                    return q.getWhere().__root._value === parent;
                }) || query;
            const limit = nodeQuery.getLimit();
            const offset = nodeQuery.getOffset();
            const position = nodeQuery.getWhere()[keyProperty + '>='] || offset || 0;
            const itemsWithParent: object[] = this.data.filter((item) => {
                return item[parentProperty] === parent;
            });
            hasMore.push({
                id: parent,
                nav_result: itemsWithParent.length,
            });
            const itemsWithParentWithLimit = itemsWithParent.slice(position, position + limit);
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
