import type { TKey } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';

import TreeHierarchyStrategy from './Controller/HierarchyStrategy/Tree';
import FlatHierarchyStrategy from './Controller/HierarchyStrategy/Flat';

export function getRecordSetByHierarchyStrategy(
    childrenProperty: string | undefined,
    root: TKey,
    items: RecordSet,
    key: TKey
): RecordSet {
    const strategy = childrenProperty ? TreeHierarchyStrategy : FlatHierarchyStrategy;
    return strategy(childrenProperty, root, items, key);
}
