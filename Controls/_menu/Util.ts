/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { IMenuBaseOptions, TKey } from 'Controls/_menu/interface/IMenuBase';
import { Model } from 'Types/entity';
import { PrefetchProxy } from 'Types/source';
import { format, RecordSet } from 'Types/collection';
import { IMenuControlOptions } from 'Controls/_menu/interface/IMenuControl';
import { create as DiCreate } from 'Types/di';

export function getItemParentKey(
    { root, parentProperty }: Pick<IMenuBaseOptions, 'root' | 'parentProperty'>,
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

export function hasPinIcon(
    {
        root,
        parentProperty,
        nodeProperty,
        allowPin,
        historyRoot,
        hierarchyViewMode,
    }: Pick<
        IMenuBaseOptions,
        | 'root'
        | 'parentProperty'
        | 'nodeProperty'
        | 'allowPin'
        | 'historyRoot'
        | 'hierarchyViewMode'
    >,
    item: Model,
    searchValue?: string
): boolean {
    const parentKey = getItemParentKey({ root, parentProperty }, item);
    const isNode =
        nodeProperty &&
        (item.get(nodeProperty) ||
            (hierarchyViewMode === 'tree' && item.get(nodeProperty) === false));
    const needSaveToHistory = !item.get('doNotSaveToHistory');
    return (
        !!allowPin &&
        needSaveToHistory &&
        item.has('pinned') &&
        !isNode &&
        (item.get('pinned') !== true || parentKey === historyRoot || !!searchValue) &&
        (!historyRoot || !!parentKey)
    );
}

export function isHistorySource(source): boolean {
    if (source instanceof PrefetchProxy) {
        source = source.getOriginal();
    }
    return source && source['[Controls/_historyOld/Source]'];
}

export function addField(
    name: string,
    items: RecordSet | Model,
    RSFormat: format.Format,
    defaultValue?: unknown
): void {
    if (RSFormat.getFieldIndex(name) === -1) {
        items.addField({
            name,
            type: 'string',
            defaultValue,
        });
    }
}

export function getEmptyItemConfig(
    items: RecordSet,
    options: Pick<
        IMenuControlOptions,
        | 'displayProperty'
        | 'parentProperty'
        | 'nodeProperty'
        | 'root'
        | 'emptyText'
        | 'emptyKey'
        | 'keyProperty'
    >
): Model {
    const { emptyText, emptyKey, keyProperty } = options;
    const emptyItem = getItemModel(items, keyProperty);

    const data = {};
    data[keyProperty] = emptyKey;
    data[options.displayProperty] = emptyText;

    if (options.parentProperty) {
        data[options.parentProperty] = options.root;
    }
    if (options.nodeProperty) {
        data[options.nodeProperty] = null;
    }
    for (const field in data) {
        if (data.hasOwnProperty(field)) {
            const fieldValue = data[field];
            addField(field, emptyItem, emptyItem.getFormat(), fieldValue);

            if (emptyItem.get(field) !== fieldValue) {
                emptyItem.set(field, fieldValue);
            }
        }
    }
    return emptyItem;
}

function getItemModel(items: RecordSet, keyProperty: string): Model {
    const model = items.getModel();
    const modelConfig = {
        keyProperty,
        format: items.getFormat(),
        adapter: items.getAdapter(),
    };
    if (typeof model === 'string') {
        return createModel(model, modelConfig);
    } else {
        return new model(modelConfig);
    }
}

function createModel(model: string, config: object): Model {
    return DiCreate(model, config);
}
