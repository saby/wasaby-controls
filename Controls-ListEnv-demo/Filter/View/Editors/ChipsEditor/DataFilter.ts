import { adapter } from 'Types/entity';

interface IFilter {
    gender?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const itemValue = item.get('gender');
    const filterValue = queryFilter.gender;
    return filterValue.includes(itemValue);
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/ChipsEditor/DataFilter';

export = filter;
