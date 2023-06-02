import { adapter } from 'Types/entity';
import { isEqual } from 'Types/object';

interface IFilter {
    owner: string[];
    amount: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let addToData = true;
    const emptyFields = {
        owner: [],
        amount: [],
    };
    for (const filterField in queryFilter) {
        if (
            queryFilter.hasOwnProperty(filterField) &&
            item.get(filterField) &&
            addToData
        ) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get(filterField);
            const itemValueIsNumber = typeof itemValue === 'number';
            addToData =
                ((itemValue >= filterValue[0] || !filterValue[0]) &&
                    (itemValue <= filterValue[1] ||
                        !filterValue[1]) &&
                    itemValueIsNumber) ||
                filterValue.includes(itemValue);
            if (
                emptyFields &&
                isEqual(filterValue, emptyFields[filterField])
            ) {
                addToData = true;
            }
        }
    }
    return addToData;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/View/DataFilter';

export = filter;
