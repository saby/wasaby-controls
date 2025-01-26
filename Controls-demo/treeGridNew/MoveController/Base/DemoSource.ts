import { DataSet, HierarchicalMemory, Query } from 'Types/source';

export default class DemoSource extends HierarchicalMemory {
    protected _moduleName: string = 'Controls-demo/treeGridNew/MoveController/Base/DemoSource';

    query(query?: Query): Promise<DataSet> {
        const passedWhere = query.getWhere();
        const newQuery = query.where((item, index) => {
            const parent = passedWhere.hasOwnProperty('parent') ? passedWhere.parent : null;
            if (parent && parent.forEach) {
                for (let i = 0; i < parent.length; i++) {
                    if (item.get('parent') === parent[i]) {
                        return true;
                    }
                }
                return false;
            }
            return item.get('parent') === parent;
        });
        return super.query(newQuery);
    }
}
