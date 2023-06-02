import { adapter } from 'Types/entity';

interface IFilter {
    isDevelopment?: {
        string: boolean;
    };
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    return queryFilter.isDevelopment ? item.get('isDevelopment') : true;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/CompositeFilter/resources/DataFilter';

export = filter;
