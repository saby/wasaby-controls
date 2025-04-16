import { adapter } from 'Types/entity';
import { isEqual } from 'Types/object';

interface IFilter {
    owners: number;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    const emptyField = [];
    let addToData = true;
    for (const filterField in queryFilter) {
        if (queryFilter.hasOwnProperty(filterField) && addToData) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get('owner');
            addToData =
                filterValue.includes(itemValue) ||
                isEqual(filterValue, emptyField) ||
                filterValue[0] === null ||
                filterValue[1] === null;
        }
    }
    return addToData;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/DataFilter';

export = filter;
