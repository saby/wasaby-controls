import { adapter } from 'Types/entity';

interface IFilter {
    response: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return (
        queryFilter.response?.includes(item.get('id')) ||
        !queryFilter.response?.length ||
        queryFilter.response?.includes('-1')
    );
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/EmptyKey/DataFilter';

export = filter;
