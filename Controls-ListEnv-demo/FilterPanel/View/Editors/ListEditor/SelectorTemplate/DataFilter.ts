import { adapter } from 'Types/entity';
import { isEqual } from 'Types/object';

function filter(item: adapter.IRecord, queryFilter): boolean {
    let addToData = true;
    const emptyFields = {
        owner: null,
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
            addToData =
                filterValue === null ||
                (Array.isArray(filterValue) && itemValue >= filterValue[0] &&
                    itemValue <= filterValue[1]) ||
                filterValue.includes(itemValue);
            if (
                (emptyFields &&
                    isEqual(
                        filterValue,
                        emptyFields[filterField]
                    )) ||
                filterValue[0] === null ||
                filterValue[1] === null
            ) {
                addToData = true;
            }
        }
    }
    return addToData;
}

filter._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/SelectorTemplate/DataFilter';

export = filter;
