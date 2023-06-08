import { HierarchicalMemory } from 'Types/source';

function generateData(count: number): unknown[] {
    const result = [];
    // eslint-disable-next-line
    const countsArray = [5, 7, 12, 3, 8, 6, 22, 1, 4, 16];
    let countIdx = 0;
    for (let i = 0; i < count; i++) {
        result.push({
            key: 'key_' + i,
            title: 'item_' + i,
            count: countsArray[countIdx],
            parent: null,
            // eslint-disable-next-line
            hasChildren: i % 3 === 0,
            type: true,
            // eslint-disable-next-line
            group: 'group_' + (i < count / 2 ? 1 : 2),
        });
        // eslint-disable-next-line
        if (i % 3 === 0) {
            // eslint-disable-next-line
            for (let j = 0; j < 3; j++) {
                result.push({
                    key: 'key_' + i + '_' + j,
                    title: 'item_' + i + '_' + j,
                    count: 0,
                    parent: 'key_' + i,
                    hasChildren: false,
                    type: true,
                    // eslint-disable-next-line
                    group: 'group_' + (i < count / 2 ? 1 : 2),
                });
            }
        }
        // eslint-disable-next-line
        countIdx = countIdx < 9 ? countIdx + 1 : 0;
    }
    return result;
}

interface IDemoCreateSourceCfg {
    count: number;
}

export function createGroupingSource(cfg: IDemoCreateSourceCfg): HierarchicalMemory {
    const sourceData = generateData(cfg.count);
    let foundedCursor = false;
    const source = new HierarchicalMemory({
        keyProperty: 'key',
        data: sourceData,
        filter: (item, filter) => {
            const parent = filter.hasOwnProperty('parent') ? filter.parent : null;
            if (parent !== null || filter['key>='] === item.get('key')) {
                foundedCursor = true;
            }
            if (filter.group) {
                return (
                    filter.group.indexOf(item.get('group')) !== -1 && item.get('parent') === parent
                );
            }
            let itemInExpandedGroup = true;
            if (
                filter.collapsedGroups &&
                filter.collapsedGroups.indexOf(item.get('group')) !== -1
            ) {
                itemInExpandedGroup = false;
            }
            return foundedCursor && itemInExpandedGroup && item.get('parent') === parent;
            // for old grouping:
            // return foundedCursor && item.get('parent') === parent;
        },
        parentProperty: 'parent',
    });
    const originalQueryFn = source.query;
    // eslint-disable-next-line
    source.query = function (): any {
        return originalQueryFn.apply(this, arguments).then((result) => {
            const resultData = result.getRawData();
            const lastResultKey = resultData.items[resultData.items.length - 1].key;
            const lastResultIndex = sourceData.findIndex((item) => {
                return item.key === lastResultKey;
            });
            const nextKey = 'key_' + (+lastResultKey.replace('key_', '') + 1);
            resultData.meta.nextPosition = [nextKey];
            resultData.meta.more = lastResultIndex < sourceData.length;
            foundedCursor = false;
            return result;
        });
    };
    return source;
}
