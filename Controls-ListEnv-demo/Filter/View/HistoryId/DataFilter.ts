import { adapter } from 'Types/entity';

interface IFilter {
    city?: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.city === item.get('id') || !queryFilter.city;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/HistoryId/DataFilter';

export = filter;
