import type { RecordSet, IRecordSetMergeOptions } from 'Types/collection';
import type { TKey } from 'Controls/interface';
import type { Direction } from 'Controls/_interface/IQueryParams';
import type { Model } from 'Types/entity';

import { merge } from 'Types/object';
import { isEqualItems } from './Utils/isEqualItems';
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

type TMergeStrategy = 'replace' | 'inject';

function getMergeStrategy(
    metaData: { mergeStrategy?: TMergeStrategy } | undefined,
    skipRemoveDuplicates: boolean | undefined
): TMergeStrategy | undefined {
    const mergeStrategy = metaData?.mergeStrategy;
    if (mergeStrategy) {
        return mergeStrategy;
    }
    if (!skipRemoveDuplicates) {
        return 'inject';
    }
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
        parent: TKey,
        options: IRecordSetMergeOptions = {
            remove: false,
            inject: true,
        }
    ): void {
        getRecordSetByHierarchyStrategy(childrenProperty, root, prevItems, parent).merge(
            newItems,
            options
        );
    }

    [RecordSetChangeType.ASSIGN_ITEMS](prevItems: RecordSet, newItems: RecordSet): void {
        prevItems.assign(newItems);
    }

    [RecordSetChangeType.REPLACE_ITEMS](_prevItems: RecordSet, _newItems: RecordSet) {}

    [RecordSetChangeType.REMOVE_ITEMS](prevItems: RecordSet, index: number, _removeItems: Model[]) {
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
    const newMetaData = newItems?.getMetaData();
    const mergeStrategy = getMergeStrategy(newMetaData, skipRemoveDuplicates);
    if (prevItems && parent === root && newItems) {
        changes.push({
            type:
                direction === 'up' || direction === 'down'
                    ? RecordSetChangeType.MERGE_META_DATA
                    : RecordSetChangeType.SET_META_DATA,
            params: [prevItems, newMetaData],
        });
    }

    if (direction === 'up') {
        if (shouldAddItems(newItems, prevItems)) {
            if (mergeStrategy) {
                const prependMergeOptions = {
                    add: false,
                    prepend: true,
                    remove: false,
                    [mergeStrategy]: true,
                };
                changes.push({
                    type: RecordSetChangeType.MERGE_ITEMS,
                    params: [
                        childrenProperty,
                        root,
                        prevItems,
                        newItems,
                        parent,
                        prependMergeOptions,
                    ],
                });
            } else {
                changes.push({
                    type: RecordSetChangeType.PREPEND_ITEMS,
                    params: [childrenProperty, root, prevItems, newItems, parent],
                });
            }
        }
    } else if (direction === 'down' && prevItems) {
        if (shouldAddItems(newItems, prevItems)) {
            if (mergeStrategy) {
                const appendMergeOptions = {
                    remove: false,
                    [mergeStrategy]: true,
                };
                changes.push({
                    type: RecordSetChangeType.MERGE_ITEMS,
                    params: [
                        childrenProperty,
                        root,
                        prevItems,
                        newItems,
                        parent,
                        appendMergeOptions,
                    ],
                });
            } else {
                changes.push({
                    type: RecordSetChangeType.APPEND_ITEMS,
                    params: [childrenProperty, root, prevItems, newItems, parent],
                });
            }
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
