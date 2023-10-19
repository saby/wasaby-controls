import { adapter } from 'Types/entity';

interface IFilter {
    post: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.post.includes(item.get('id')) || !queryFilter.post.length;
}

filter._moduleName = 'Controls-ListEnv-demo/FilterPanel/View/Source/IsAdaptive/DataFilter';

export = filter;
