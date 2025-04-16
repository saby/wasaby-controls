import { adapter } from 'Types/entity';
function filter(item: adapter.IRecord, queryFilter): boolean {
    if (queryFilter?.department?.replace('_history', '') === item.getData().department) {
        return true;
    }
    return false;
}
filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/HistoryWithHierarchy/ListDataFilter';

export = filter;
