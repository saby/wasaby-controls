import { adapter } from 'Types/entity';
interface IFilter {
    document?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const resetValue = null;
    return (
        queryFilter.document === item.get('document') ||
        queryFilter.document === resetValue
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterDetail/Hierarchy/DataFilter';

export = filter;
