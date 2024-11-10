import { adapter } from 'Types/entity';

interface IFilter {
    city?: string;
    department?: string;
    owner?: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const city = queryFilter.city?.includes(item.get('city')) || !queryFilter.city?.length;
    const owner = queryFilter.owner?.includes(item.get('owner')) || !queryFilter.owner?.length;
    const department =
        queryFilter.department === item.get('department') || !queryFilter.department?.length;
    return city && owner && department;
}

filter._moduleName = 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/DataFilter';

export = filter;
