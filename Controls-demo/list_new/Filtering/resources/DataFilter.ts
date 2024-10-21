import { adapter } from 'Types/entity';

interface IFilter {
    title?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.title?.includes(item.get('title')) || !queryFilter.title;
}

filter._moduleName = 'Controls-demo/list_new/Filtering/resources/DataFilter';

export = filter;
