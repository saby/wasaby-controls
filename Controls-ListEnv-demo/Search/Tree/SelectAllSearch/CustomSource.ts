import { HierarchicalMemory, Query, DataSet } from 'Types/source';

export default class CustomSource extends HierarchicalMemory {
    protected _moduleName: string = 'Controls-ListEnv-demo/Search/Tree/SelectAllSearch/CustomSource';

    query(query?: Query): Promise<DataSet> {
        const passedWhere = query.getWhere();
        const newQuery = query.where((item, index) => {
            if (!passedWhere || !passedWhere.title) {
                return true;
            }

            const itemTitle = item.get('title').toLowerCase();
            const searchValue = passedWhere.title.toLowerCase();
            return itemTitle.includes(searchValue);
        });
        return super.query(newQuery);
    }
}
