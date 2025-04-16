import { DataSet, HierarchicalMemory, Query } from 'Types/source';

export default class DemoSource extends HierarchicalMemory {
    protected _moduleName: string =
        'Controls-Layout-demo/SelectorStack/SelectorTemplate/prefetchConfig/HierarchicalMemory';

    query(query?: Query): Promise<DataSet> {
        const passedWhere = query.getWhere();
        const newQuery = query.where((item, index) => {
            const parent = passedWhere.hasOwnProperty('parent') ? passedWhere.parent : null;
            if (passedWhere.hasOwnProperty('selection')) {
                const parent = passedWhere.parent || null;
                const selectedKeys = passedWhere.selection.get('marked');
                const excludedKeys = passedWhere.selection.get('excluded');
                return (
                    selectedKeys.includes(String(item.get('id'))) ||
                    (selectedKeys.includes(parent) &&
                        !excludedKeys.includes(String(item.get('id'))))
                );
            }
            return item.get('parent') === parent;
        });
        return super.query(newQuery);
    }
}
