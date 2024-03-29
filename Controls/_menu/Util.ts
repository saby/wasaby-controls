/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { IMenuBaseOptions, TKey } from 'Controls/_menu/interface/IMenuBase';
import { Model } from 'Types/entity';

export function getItemParentKey(
    { root, parentProperty }: Partial<IMenuBaseOptions>,
    item: Model
): TKey {
    const isStringType = typeof root === 'string';
    let parent: TKey = item.get(parentProperty);
    if (parent === undefined) {
        parent = null;
    }
    // Для исторических меню keyProperty всегда заменяется на строковый.
    // Если изначально был указан целочисленный ключ,
    // то в поле родителя будет лежать также целочисленное значение, а в root будет лежать строка.
    if (isStringType) {
        parent = String(parent);
    }
    return parent;
}

export function hasPinIcon(options: IMenuBaseOptions, item: Model): boolean {
    const parentKey = getItemParentKey(options, item);
    const isNode = item.get(options.nodeProperty);
    const needSaveToHistory = !item.get('doNotSaveToHistory');
    return (
        options.allowPin &&
        needSaveToHistory &&
        item.has('pinned') &&
        !isNode &&
        (item.get('pinned') !== true ||
            parentKey === options.historyRoot ||
            options.searchValue) &&
        (!options.historyRoot || !!parentKey)
    );
}
