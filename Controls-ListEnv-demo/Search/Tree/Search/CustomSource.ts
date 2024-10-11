import { HierarchicalMemory, Query, DataSet } from 'Types/source';
import { IObject, relation, Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

const DATA = new RecordSet({ rawData: data, keyProperty: 'key' });

const HIERARCHY = new relation.Hierarchy({
    keyProperty: 'key',
    parentProperty: 'parent',
    nodeProperty: 'type',
});

function matchItem(searchTitle: string, item: IObject): boolean {
    const title = item.get('title').toLowerCase();
    return title.indexOf(searchTitle.toLowerCase()) !== -1;
}

function hasFoundChild(searchTitle: string, item: IObject): boolean {
    const children = HIERARCHY.getChildren(item, DATA);
    return children.some((child) => {
        const match = matchItem(searchTitle, item);
        if (match) {
            return true;
        }

        if (HIERARCHY.isNode(child)) {
            return hasFoundChild(searchTitle, child);
        }

        return false;
    });
}

export default class CustomSource extends HierarchicalMemory {
    protected _moduleName: string = 'Controls-ListEnv-demo/Search/Tree/Search/CustomSource';

    query(query?: Query): Promise<DataSet> {
        const passedWhere = query.getWhere();
        const newQuery = query.where((item, index) => {
            const searchTitle = passedWhere?.title;
            if (!searchTitle) {
                return true;
            }

            const match = matchItem(searchTitle, item);
            if (match) {
                return true;
            }

            const record = new Model({
                rawData: item.getData(),
                keyProperty: 'key',
            });
            if (HIERARCHY.isNode(record)) {
                return hasFoundChild(searchTitle, record);
            }

            return false;
        });
        return super.query(newQuery);
    }
}
