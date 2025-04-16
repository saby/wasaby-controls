import { adapter } from 'Types/entity';

function filter(item: adapter.IRecord, queryFilter): boolean {
    if (queryFilter.parent) {
        if (queryFilter.parent === item.getData().parent) {
            return true;
        }
        return false;
    }
    return true;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/HistoryWithHierarchy/DataFilter';

export = filter;
