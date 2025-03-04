import { adapter } from 'Types/entity';

interface IFilter {
    title?: string;
    booleanEditor?: boolean;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
    let addToData = true;
    if (queryFilter.title) {
        const itemTitle = item.get('title').toLowerCase();
        const filterTitle = queryFilter.title.toLowerCase();
        addToData = itemTitle.includes(filterTitle);
    }
    if (queryFilter.booleanEditor) {
        addToData = queryFilter.booleanEditor === item.get('isDevelopment');
    }
    return addToData;
}

filter._moduleName = 'Controls-Layout-demo/SelectorStack/DataFilter';

export = filter;
