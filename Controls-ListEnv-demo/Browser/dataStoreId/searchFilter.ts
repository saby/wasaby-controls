import { adapter } from 'Types/entity';
import { isEqual } from 'Types/object';
interface IFilter {
    country?: string;
    description?: string;
    parent?: number;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let add = true;

    const resetValue = {
        discount: false
    };
    const currentFilters = { ...resetValue, ...queryFilter };
    if (queryFilter.description) {
        const itemTitle = item.get('description')?.toLowerCase() || '';
        const filterTitle = queryFilter.description?.toLowerCase() || '';
        add = itemTitle.includes(filterTitle);
    }
    if (!queryFilter.description || (queryFilter.description && add)) {
        return Object.entries(currentFilters).every(
            ([filterKey, filterValue]) => {
                const itemValue = item.get(filterKey);
                return (
                    filterKey === 'description' ||
                    filterKey === 'parent' ||
                    itemValue === filterValue ||
                    (Array.isArray(filterValue) &&
                        filterValue.includes(itemValue)) ||
                    isEqual(filterValue, resetValue[filterKey]) ||
                    item.get(filterKey) === undefined
                );
            }
        );
    }
}

filter._moduleName = 'Controls-ListEnv-demo/Browser/dataStoreId/searchFilter';

export = filter;
