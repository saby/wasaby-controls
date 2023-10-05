import { adapter } from 'Types/entity';

interface IFilter {
    gender?: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const itemValue = item.get('gender');
    const filterValue = queryFilter.gender;
    return itemValue === filterValue;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/Editors/TumblerEditor/DataFilter';

export = filter;
