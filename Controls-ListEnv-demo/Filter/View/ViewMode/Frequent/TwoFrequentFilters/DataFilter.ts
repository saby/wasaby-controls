import { adapter } from 'Types/entity';

interface IFilter {
    response: string[];
    department: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return (
        (queryFilter.response?.includes(item.get('id')) ||
            !queryFilter.response?.length) &&
        (queryFilter.department?.includes(item.get('department')) ||
            !queryFilter.department?.length)
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/TwoFrequentFilters/DataFilter';

export = filter;
