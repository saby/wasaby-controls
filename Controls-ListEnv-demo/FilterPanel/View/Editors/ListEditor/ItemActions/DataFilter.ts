import { adapter } from 'Types/entity';

interface IFilter {
    owner: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let addToData = true;
    for (const filterField in queryFilter) {
        if (queryFilter.hasOwnProperty(filterField) && item.get(filterField)) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get(filterField);
            addToData =
                filterValue === null || filterValue.includes(itemValue) || !filterValue.length;
        }
    }
    return addToData;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ItemActions/DataFilter';

export = filter;
