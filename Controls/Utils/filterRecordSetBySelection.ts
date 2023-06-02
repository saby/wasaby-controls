import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

interface IOptions {
    keyProperty: string;
    parentProperty?: string;
    nodeProperty?: string;
}

function getItemByKey(items: RecordSet, key: TKey, keyProperty: string): Model {
    return items?.at(items.getIndexByValue(keyProperty, key));
}

function addParentsToExcluded(key: string, items: RecordSet, options: IOptions): TKey[] {
    const excluded = [];
    const item = getItemByKey(items, key, options.keyProperty);
    let parentKey = item.get(options.parentProperty);
    while (parentKey) {
        if (!excluded.includes(parentKey)) {
            excluded.push(parentKey);
        }
        parentKey = getItemByKey(items, parentKey, options.keyProperty)?.get(options.parentProperty);
    }
    return excluded;
}

function addChildrenToSelected(key: string,
                               excludedWithParents: TKey[],
                               excludedKeys: TKey[],
                               items: RecordSet,
                               options: IOptions): TKey[] {
    let selected = [];
    const children = items.getIndicesByValue(options.parentProperty, key);
    children.forEach((child) => {
        const childItem = items.at(child);
        const childKey = childItem.get(options.keyProperty);
        if (!excludedKeys.includes(childKey)) {
            selected.push(childKey);
            if (childItem.get(options.nodeProperty) && excludedWithParents.includes(childKey)) {
                selected = selected.concat(
                    addChildrenToSelected(childKey, excludedWithParents, excludedKeys, items, options));
            }
        }
    });
    return selected;
}

export function filterRecordSetBySelection(
    selectedKeys: TKey[],
    excludedKeys: TKey[],
    items: RecordSet,
    options: IOptions,
): Model[] {
    const selectedItems = [];
    let selectedWithChildren = selectedKeys ? [...selectedKeys] : [];
    let excludedWithParents = excludedKeys ? [...excludedKeys] : [];

    if (options.parentProperty) {
        if (excludedKeys && excludedKeys.length) {
            excludedWithParents = excludedKeys.flatMap((key) => {
                return addParentsToExcluded(key, items, options);
            });
        }
        selectedWithChildren = selectedKeys.flatMap((key) => {
            if (excludedWithParents.includes(key)) {
                return addChildrenToSelected(key, excludedWithParents, excludedKeys, items, options);
            }
            return [key];
        });
    }

    selectedWithChildren.forEach((key: string) => {
        if (!excludedWithParents.includes(key)) {
            const item = getItemByKey(items, key, options.keyProperty);
            if (item) {
                selectedItems.push(item);
            }
        }
    });
    return selectedItems;
}
