import { adapter } from 'Types/entity';

interface IFilter {
    response: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.response?.includes(item.get('id')) || !queryFilter.response?.length;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/resources/DataFilter';

export = filter;
