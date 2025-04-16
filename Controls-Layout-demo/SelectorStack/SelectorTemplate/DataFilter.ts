import { adapter } from 'Types/entity';

interface IFilter {
    title?: string;
    discount?: boolean;
    id: string[];
    selection?: unknown;
    parent: number;
}

function filter(item: adapter.IRecord, queryFilter: IFilter | Function): boolean {
    let addToData = true;
    if (queryFilter.title) {
        const itemTitle = item.get('title').toLowerCase();
        const filterTitle = queryFilter.title.toLowerCase();
        addToData = itemTitle.includes(filterTitle);
    }
    if (queryFilter.hasOwnProperty('discount')) {
        addToData = queryFilter.discount === item.get('discount');
    }

    if (queryFilter.selection) {
        const parent = queryFilter.parent || null;
        const selectedKeys = queryFilter.selection.get('marked');
        const excludedKeys = queryFilter.selection.get('excluded');
        addToData =
            addToData &&
            (selectedKeys.includes(String(item.get('id'))) ||
                (selectedKeys.includes(parent) && !excludedKeys.includes(String(item.get('id')))));
    }

    if (queryFilter.hasOwnProperty('id')) {
        addToData = addToData && queryFilter.id.includes(item.get('id'));
    }

    if (typeof queryFilter === 'function') {
        return queryFilter(item);
    }

    return addToData;
}

filter._moduleName = 'Controls-Layout-demo/SelectorStack/SelectorTemplate/DataFilter';

export = filter;
