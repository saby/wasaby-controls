import { adapter } from 'Types/entity';

function filter(item: adapter.IRecord, queryFilter: object): boolean {
    let addToData = true;
    for (const filterField in queryFilter) {
        if (queryFilter.hasOwnProperty(filterField) && item.get(filterField)) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get(filterField);
            addToData = filterValue === itemValue || !filterValue;
        }
    }
    return addToData;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ImageProperty/DataFilter';

export = filter;
