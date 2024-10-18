import { adapter } from 'Types/entity';
import { isEqual } from 'Types/object';

interface IFilter {
    owner: string;
    department: string;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let addToData = true;
    const emptyFields = {
        owner: null,
        department: null,
    };
    for (const filterField in queryFilter) {
        if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get(filterField);
            addToData =
                filterValue === itemValue ||
                (emptyFields && isEqual(filterValue, emptyFields[filterField]));
        }
    }
    return addToData;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Source/FilterChangedCallback/DataFilter';

export = filter;
