import { adapter, Model } from 'Types/entity';
import { isEqual } from 'Types/object';
interface IFilter {
    country?: string;
    title?: string;
    parent?: string;
}

function filterByParent(item: Model, parent?: string): boolean {
    if (parent) {
        const itemParent = item.get('parent');
        return itemParent === parent;
    }
    return true;
}

function filter(item: Model, queryFilter: IFilter): boolean {
    let add = true;
    let addByParent = true;
    const resetValue = {
        country: null,
        inStock: null,
        type: null,
        company: null,
        primaryCompany: null,
        screenType: [],
    };
    const currentFilters = { ...resetValue, ...queryFilter };
    if (queryFilter.title) {
        const itemTitle = item.get('title').toLowerCase();
        const filterTitle = queryFilter.title.toLowerCase();
        add = itemTitle.includes(filterTitle);
    }
    if (queryFilter.parent && !Array.isArray(queryFilter.parent)) {
        addByParent = filterByParent(item, queryFilter.parent);
    }
    if (addByParent && (!queryFilter.title || (queryFilter.title && add))) {
        return Object.entries(currentFilters).every(([filterKey, filterValue]) => {
            const itemValue = item.get(filterKey);
            return (
                filterKey === 'title' ||
                filterKey === 'parent' ||
                itemValue === filterValue ||
                (Array.isArray(filterValue) && filterValue.includes(itemValue)) ||
                isEqual(filterValue, resetValue[filterKey]) ||
                item.get(filterKey) === undefined
            );
        });
    }
}

filter._moduleName = 'Controls-ListEnv-demo/StoreIdConnected/DataFilter';

export = filter;
