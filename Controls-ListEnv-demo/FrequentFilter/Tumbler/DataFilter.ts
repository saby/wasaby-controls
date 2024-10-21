import { adapter } from 'Types/entity';

function filter(item: adapter.IRecord, queryFilter): boolean {
    let addToData = true;
    for (const filterField in queryFilter) {
        if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get(filterField);
            addToData = !filterValue[0] || filterValue.includes(itemValue);
        }
    }
    return addToData;
}

filter._moduleName = 'Controls-ListEnv-demo/FrequentFilter/Tumbler/DataFilter';

export = filter;
