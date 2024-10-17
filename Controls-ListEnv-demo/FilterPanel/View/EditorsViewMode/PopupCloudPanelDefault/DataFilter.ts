import { adapter } from 'Types/entity';
interface IFilter {
    department?: string;
    city?: string[];
    owner?: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.folder === item.get('id') || !queryFilter.folder;
}

filter._moduleName = 'Controls-ListEnv-demo/FilterPanel/View/EditorsViewMode/Default/DataFilter';

export = filter;
