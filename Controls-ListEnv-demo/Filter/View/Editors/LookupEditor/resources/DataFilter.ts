import { adapter } from 'Types/entity';

interface IFilter {
    city?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.city?.includes(item.get('id')) || !queryFilter.city?.length;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/DataFilter';

export = filter;
