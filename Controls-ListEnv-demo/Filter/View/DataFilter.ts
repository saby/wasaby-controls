import { adapter } from 'Types/entity';

interface IFilter {
    city: 'string';
    name: 'string';
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let addToData = true;
    for (const filterField in queryFilter) {
        if (
            queryFilter.hasOwnProperty(filterField) &&
            item.get(filterField) &&
            addToData
        ) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get(filterField);
            addToData = !filterValue || filterValue === itemValue;
        }
    }
    return addToData;
}

filter._moduleName = 'Controls-ListEnv-demo/Filter/View/DataFilter';

export = filter;
