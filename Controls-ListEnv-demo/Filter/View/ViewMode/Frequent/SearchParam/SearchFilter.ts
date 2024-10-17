import { Model } from 'Types/entity';

function SearchFilter(item: Model, queryFilter: { title?: string }): boolean {
    if (queryFilter.title) {
        return item.get('title').toLowerCase().includes(queryFilter.title.toLowerCase());
    }
    return true;
}

SearchFilter._moduleName =
    'Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/SearchParam/SearchFilter';

export = SearchFilter;
