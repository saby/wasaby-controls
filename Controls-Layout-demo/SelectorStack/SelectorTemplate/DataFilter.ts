import { adapter } from 'Types/entity';

interface IFilter {
    title?: string;
    discount?: boolean;
    id: string[];
    selection?: unknown;
    parent: number;
}

function filter(item: adapter.IRecord, queryFilter: IFilter): boolean {
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
        addToData =
            addToData &&
            (queryFilter.selection.get('marked').includes(String(item.get('id'))) ||
                queryFilter.selection.get('marked').includes(parent));
    }

    if (queryFilter.hasOwnProperty('id')) {
        addToData = addToData && queryFilter.id.includes(item.get('id'));
    }

    return addToData;
}

filter._moduleName = 'Controls-Layout-demo/SelectorStack/SelectorTemplate/DataFilter';

export = filter;
