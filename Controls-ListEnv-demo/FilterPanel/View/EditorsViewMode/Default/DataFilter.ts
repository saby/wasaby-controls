import { adapter } from 'Types/entity';
interface IFilter {
    department?: string;
    city?: string[];
    owner?: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const department = queryFilter.department === item.get('department') || !queryFilter.department;
    const city = queryFilter.city.includes(item.get('city')) || !queryFilter.city.length;
    const owner = queryFilter.owner.includes(item.get('owner')) || !queryFilter.owner.length;
    return department && city && owner;
}

filter._moduleName = 'Controls-ListEnv-demo/FilterPanel/View/EditorsViewMode/Default/DataFilter';

export = filter;
