import { adapter } from 'Types/entity';

interface IFilter {
    department: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return (
        queryFilter.department?.includes(item.get('id')) ||
        !queryFilter.department?.length
    );
}

filter._moduleName =
    'Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/FrequentItemsWithHistory/DataFilter';

export = filter;
