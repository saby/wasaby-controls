import { adapter } from 'Types/entity';
interface IFilter {
    document?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const resetValue = 'Все документы';
    return (
        item.get('document') === queryFilter.document ||
        item.get('parent') === queryFilter.document ||
        queryFilter.document === resetValue
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterDetail/HierarchyWithHierarchyList/DataFilter';

export = filter;
