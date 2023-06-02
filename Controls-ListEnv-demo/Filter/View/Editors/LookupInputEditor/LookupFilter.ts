import { adapter } from 'Types/entity';

interface IFilter {
    owner: string;
    title: string;
    id: string[];
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    if (queryFilter.title) {
        return item.get('title').indexOf(queryFilter.title) !== -1;
    }
    if (queryFilter.id) {
        return queryFilter.id.includes(item.get('id'));
    }
    return true;
}

filter._moduleName =
    'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/LookupFilter';

export = filter;
