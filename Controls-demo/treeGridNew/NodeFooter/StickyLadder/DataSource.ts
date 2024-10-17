import { CrudEntityKey, DataSet, HierarchicalMemory, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';

export default class MyHierarchicalMemory extends HierarchicalMemory {
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
