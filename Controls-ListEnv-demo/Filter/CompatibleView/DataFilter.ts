import { adapter } from 'Types/entity';

interface IFilter {
    data?: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let addToData = true;
    for (const filterField in queryFilter) {
        if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
            const filterValue = queryFilter[filterField]?.[0];
            const itemValue = item.get(filterField);
            addToData = !filterValue || filterValue === itemValue;
        }
    }
    return addToData;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/CompatibleView/DataFilter';

export = filter;
