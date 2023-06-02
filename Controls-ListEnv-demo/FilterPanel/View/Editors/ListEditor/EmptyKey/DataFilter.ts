import { adapter } from 'Types/entity';
import { isEqual } from 'Types/object';

interface IFilter {
    dateEditorTerm: Date[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let addToData = true;
    const emptyFields = {
        owner: [],
    };
    for (const filterField in queryFilter) {
        if (
            queryFilter.hasOwnProperty(filterField) &&
            item.get(filterField) &&
            addToData
        ) {
            const filterValue = queryFilter[filterField];
            const itemValue = item.get(filterField);
            addToData = filterValue.includes(itemValue);
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
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EmptyKey/DataFilter';

export = filter;
