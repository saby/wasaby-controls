import { adapter } from 'Types/entity';

interface IFilter {
    department?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const filterValue = queryFilter.department;
    const itemValue = item.get('department');
    return !filterValue || filterValue === itemValue;
}

filter._moduleName = 'Controls-ListEnv-demo/Actions/CopyPageUrlWithListParams/DataFilter';

export = filter;
