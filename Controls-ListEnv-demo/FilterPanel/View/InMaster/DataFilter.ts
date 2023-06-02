import { adapter } from 'Types/entity';
interface IFilter {
    department?: string;
    gender?: string[];
    owner?: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const resetValue = {
        department: 'Все',
    };
    const department =
        queryFilter.department === item.get('department') ||
        queryFilter.department === resetValue.department ||
        !queryFilter.department;
    const owner =
        queryFilter.owner.includes(item.get('owner')) ||
        !queryFilter.owner.length;
    const gender =
        queryFilter.gender === item.get('gender') || !queryFilter.gender;
    return department && gender && owner;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/InMaster/DataFilter';

export = filter;
