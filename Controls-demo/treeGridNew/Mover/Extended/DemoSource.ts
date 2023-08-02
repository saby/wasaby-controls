import { HierarchicalMemory, IMemoryOptions, Query, DataSet } from 'Types/source';

interface IExpandedMemorySource extends IMemoryOptions {
    parentProperty?: string;
}

export default class DemoSource extends HierarchicalMemory {
    protected _moduleName: string = 'Controls-demo/treeGridNew/Mover/Extended/DemoSource';

    constructor(options: IExpandedMemorySource) {
        super(options);
    }

    query(query?: Query): Promise<DataSet> {
        const passedWhere = query.getWhere();
        const newQuery = query.where((item, index) => {
            let parent = passedWhere.hasOwnProperty('parent') ? passedWhere.parent : null;
            if (parent && parent.forEach) {
                for (let i = 0; i < parent.length; i++) {
                    if (item.get('parent') === parent[i]) {
                        return true;
                    }
                }
                return false;
            } else {
                return item.get('parent') === parent;
            }
        });
        return super.query(newQuery);
    }
}
