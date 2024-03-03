import { adapter } from 'Types/entity';

interface IFilter {
    owner: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.owner === item.get('id') || !queryFilter.owner?.length;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ImageTemplate/DataFilter';

export = filter;
