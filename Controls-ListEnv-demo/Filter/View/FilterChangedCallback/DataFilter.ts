import { adapter } from 'Types/entity';

interface IFilter {
    city?: string;
    gender?: string;
    salary?: number;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const city = queryFilter.city?.includes(item.get('city')) || !queryFilter.city?.length;
    const gender = queryFilter.gender === item.get('gender') || !queryFilter.gender?.length;
    return city && gender;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/FilterChangedCallback/DataFilter';

export = filter;
