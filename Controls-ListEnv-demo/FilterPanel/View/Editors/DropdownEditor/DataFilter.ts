import { adapter } from 'Types/entity';

interface IFilter {
    department: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.department === item.get('id') || !queryFilter.department;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/DataFilter';

export = filter;
