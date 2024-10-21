import type { RecordSet } from 'Types/collection';
import type { TKey } from 'Controls/interface';
import type { Direction } from 'Controls/_interface/IQueryParams';
import type { Model } from 'Types/entity';

import { merge } from 'Types/object';
import { isEqualItems } from './isEqualItems';
import { getRecordSetByHierarchyStrategy } from './getRecordSetByHierarchyStrategy';

export enum RecordSetChangeType {
    MERGE_META_DATA = 'mergeMetaData',
    SET_META_DATA = 'setMetaData',
    PREPEND_ITEMS = 'prependItems',
    APPEND_ITEMS = 'appendItems',
    MERGE_ITEMS = 'mergeItems',
    ASSIGN_ITEMS = 'assignItems',
    REPLACE_ITEMS = 'replaceItems',
    REMOVE_ITEMS = 'removeItems',
}

export type RecordSetChange = {
    [type in RecordSetChangeType]: {
        type: type;
        params: Parameters<RecordSetDiffer[type]>;
    };
}[RecordSetChangeType];

export type RecordSetChangeSideEffects = Partial<{
    [type in RecordSetChangeType]: RecordSetDiffer[type];
}>;

function shouldAddItems(newItems: RecordSet, oldItems: RecordSet): boolean {
    return newItems.getCount() > 0 || oldItems.getCount() === 0;
}

function removeDuplicates(
    oldItems: RecordSet,
    newItems: RecordSet,
    skipRemoveDuplicates?: boolean
): RecordSetChange[] {
    const changes: RecordSetChange[] = [];
    if (!skipRemoveDuplicates) {
        let index = 0;
        let delta = 0;
        const keyProperty = oldItems.getKeyProperty();
        const filter = new Set<TKey>();
        newItems.each((item) => filter.add(item.get(keyProperty)));
        oldItems.each((item) => {
            if (filter.has(item.get(keyProperty))) {
                changes.push({
                    type: RecordSetChangeType.REMOVE_ITEMS,
                    params: [oldItems, index - delta, [oldItems.at(index)]],
                });
                delta++;
            }
            index++;
        });
    }
    return changes;
}

export class RecordSetDiffer {
    protected _sideEffects: RecordSetChangeSideEffects;
    constructor(sideEffects?: RecordSetChangeSideEffects) {
        this._sideEffects = { ...sideEffects };
    }

    applyChanges(changes: RecordSetChange[]) {
        for (const { type, params } of changes) {
            (this[type] as Function)(...params);
            (this._sideEffects[type] as Function)?.(...params);
        }
    }

    [RecordSetChangeType.MERGE_META_DATA](prevItems: RecordSet, metaData: unknown): void {
        prevItems.setMetaData(merge(prevItems.getMetaData(), metaData));
    }

    [RecordSetChangeType.SET_META_DATA](prevItems: RecordSet, metaData: unknown): void {
        prevItems.setMetaData(metaData);
    }

    [RecordSetChangeType.PREPEND_ITEMS](
        childrenProperty: string | undefined,
        root: TKey,
        prevItems: RecordSet,
        newItems: RecordSet,
        parent: TKey
    ): void {
        getRecordSetByHierarchyStrategy(childrenProperty, root, prevItems, parent).prepend(
            newItems
        );
    }

    [RecordSetChangeType.APPEND_ITEMS](
        childrenProperty: string | undefined,
        root: TKey,
        prevItems: RecordSet,
        newItems: RecordSet,
        parent: TKey
    ): void {
        getRecordSetByHierarchyStrategy(childrenProperty, root, prevItems, parent).append(newItems);
    }

    [RecordSetChangeType.MERGE_ITEMS](
        childrenProperty: string | undefined,
        root: TKey,
        prevItems: RecordSet,
        newItems: RecordSet,
        parent: TKey
    ): void {
        getRecordSetByHierarchyStrategy(childrenProperty, root, prevItems, parent).merge(newItems, {
            remove: false,
            inject: true,
        });
    }

    [RecordSetChangeType.ASSIGN_ITEMS](prevItems: RecordSet, newItems: RecordSet): void {
        prevItems.assign(newItems);
    }

    // @ts-ignore
    [RecordSetChangeType.REPLACE_ITEMS](prevItems: RecordSet, newItems: RecordSet) {}

    [RecordSetChangeType.REMOVE_ITEMS](
        prevItems: RecordSet,
        index: number,
        // @ts-ignore
        removeItems: Model[]
    ) {
        prevItems.removeAt(index);
    }
}

export function calculateAddItemsChanges(
    prevItems: RecordSet,
    newItems: RecordSet,
    direction: Direction | undefined,
    parent: TKey = null,
    root: TKey = null,
    childrenProperty?: string | undefined,
    skipRemoveDuplicates?: boolean
): RecordSetChange[] {
    const changes: RecordSetChange[] = [];
    if (prevItems && parent === root && newItems) {
        changes.push({
            type:
                direction === 'up' || direction === 'down'
                    ? RecordSetChangeType.MERGE_META_DATA
                    : RecordSetChangeType.SET_META_DATA,
            params: [prevItems, newItems.getMetaData()],
        });
    }

    if (direction === 'up') {
        if (shouldAddItems(newItems, prevItems)) {
            changes.push(...removeDuplicates(prevItems, newItems, skipRemoveDuplicates), {
                type: RecordSetChangeType.PREPEND_ITEMS,
                params: [childrenProperty, root, prevItems, newItems, parent],
            });
        }
    } else if (direction === 'down' && prevItems) {
        if (shouldAddItems(newItems, prevItems)) {
            changes.push(...removeDuplicates(prevItems, newItems, skipRemoveDuplicates), {
                type: RecordSetChangeType.APPEND_ITEMS,
                params: [childrenProperty, root, prevItems, newItems, parent],
            });
        }
    } else if (!direction && parent !== root && prevItems) {
        changes.push({
            type: RecordSetChangeType.MERGE_ITEMS,
            params: [childrenProperty, root, prevItems, newItems, parent],
        });
    } else {
        if (prevItems && isEqualItems(prevItems, newItems)) {
            changes.push({
                type: RecordSetChangeType.ASSIGN_ITEMS,
                params: [prevItems, newItems],
            });
        } else {
            changes.push({
                type: RecordSetChangeType.REPLACE_ITEMS,
                params: [prevItems, newItems],
            });
        }
    }

    return changes;
}
