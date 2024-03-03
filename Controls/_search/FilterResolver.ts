import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { TFilter } from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';

const SERVICE_FILTERS = {
    HIERARCHY: {
        Разворот: 'С разворотом',
        usePages: 'full',
    },
};

const SEARCH_STARTED_ROOT_FIELD = 'searchStartedFromRoot';

const SWITCHED_STR_FIELD = 'switchedStr';

function getSwitcherStrFromData(data: RecordSet): string {
    const metaData = data?.getMetaData?.();
    const switchedStr = metaData?.[SWITCHED_STR_FIELD] ?? '';
    const switchedStrResults = metaData?.results?.get?.(SWITCHED_STR_FIELD) || '';
    return switchedStr || switchedStrResults;
}

function needChangeSearchValueToSwitchedString(items: RecordSet): boolean {
    const metaData = items && items.getMetaData();
    return metaData ? metaData.returnSwitched : false;
}

function getRootForSearch(
    path: Model[],
    curRoot: CrudEntityKey,
    parentProperty: string,
    searchStartingWith: string = 'root'
): CrudEntityKey {
    let root;

    if (searchStartingWith === 'root' && path?.length > 0) {
        root = path[0].get(parentProperty);
    } else {
        root = curRoot;
    }

    return root;
}

function getFilterForSearch(
    listState: {
        parentProperty?: string;
        searchStartingWith?: string;
        filter: TFilter;
        searchParam: string;
        root?: CrudEntityKey;
        breadCrumbsItems?: Model[];
        deepReload?: boolean;
        sourceController?: SourceController;
        expandedItems?: CrudEntityKey[];
    },
    searchValue: string,
    rootBeforeSearch?: CrudEntityKey
): TFilter {
    let root;
    const { parentProperty, searchParam, searchStartingWith, filter } = listState;
    let searchFilter = { ...filter } as TFilter;
    searchFilter[searchParam] = searchValue;

    if (parentProperty) {
        if (listState.root !== undefined) {
            root = getRootForSearch(
                listState.breadCrumbsItems,
                listState.root,
                parentProperty,
                searchStartingWith
            );

            if (root !== undefined) {
                if (listState.deepReload) {
                    searchFilter = SourceController.prepareFilterWithExpandedItems(
                        searchFilter,
                        listState.expandedItems || listState.sourceController?.getExpandedItems(),
                        parentProperty,
                        root
                    );
                } else {
                    searchFilter[parentProperty] = root;
                }
            } else {
                delete searchFilter[parentProperty];
            }
        }
        if (
            searchStartingWith === 'root' &&
            rootBeforeSearch !== undefined &&
            rootBeforeSearch !== root
        ) {
            searchFilter[SEARCH_STARTED_ROOT_FIELD] = rootBeforeSearch;
        }
        Object.assign(searchFilter, SERVICE_FILTERS.HIERARCHY);
    }

    return searchFilter;
}

function getResetSearchFilter(
    filter: TFilter,
    searchParam: string,
    parentProperty: string,
    removeHierarchyFilters: boolean,
    removeRoot: boolean
): TFilter {
    const resultFilter = { ...filter };
    delete resultFilter[searchParam];

    if (parentProperty) {
        delete resultFilter[SEARCH_STARTED_ROOT_FIELD];
        if (removeHierarchyFilters) {
            for (const i in SERVICE_FILTERS.HIERARCHY) {
                if (SERVICE_FILTERS.HIERARCHY.hasOwnProperty(i)) {
                    delete resultFilter[i];
                }
            }
        }

        if (removeRoot) {
            delete resultFilter[parentProperty];
        }
    }

    return resultFilter;
}

function getExpandedItemsForRoot(
    newRoot: CrudEntityKey,
    currentRoot: CrudEntityKey,
    items: RecordSet,
    parentProperty: string
): CrudEntityKey[] {
    const expandedItems = [];
    let item;
    let nextItemKey = newRoot;
    do {
        item = items.getRecordById(nextItemKey);
        nextItemKey = item.get(parentProperty);
        expandedItems.unshift(item.getId());
    } while (nextItemKey !== currentRoot);

    return expandedItems;
}

function hasHierarchyFilter(filter: TFilter): boolean {
    return !!Object.entries(SERVICE_FILTERS.HIERARCHY)[0].find((key: string) => {
        return filter.hasOwnProperty(key) && filter[key] === SERVICE_FILTERS.HIERARCHY[key];
    })?.length;
}

export default {
    getFilterForSearch,
    getResetSearchFilter,
    getSwitcherStrFromData,
    hasHierarchyFilter,
    getRootForSearch,
    needChangeSearchValueToSwitchedString,
    getExpandedItemsForRoot,
};
