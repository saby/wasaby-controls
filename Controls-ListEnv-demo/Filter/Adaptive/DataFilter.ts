import { adapter } from 'Types/entity';

interface IFilter {
    capital: number;
    country: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let capitalFilter = true;
    if (queryFilter.capital) {
        capitalFilter = queryFilter.capital === item.get('id');
    }
    return capitalFilter;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/Adaptive/DataFilter';

export = filter;
