import dedupeArray from './utils/dedupeArray';
import type { TKey } from 'Controls-DataEnv/interface';
import type { RecordSet } from 'Types/collection';
import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IHierarchyState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import type { TExpansionModel } from '../interface/IAbstractListStateParts/IHierarchyState';

export default function initState(
    initializer: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IHierarchyState {
    return {
        root: config.root === undefined ? null : config.root,
        expandedItems: dedupeArray(config.expandedItems, 'expandedItems') || [],
        collapsedItems: dedupeArray(config.collapsedItems, 'collapsedItems') || [],
        singleExpand: !!config.singleExpand,
        expansionModel: getExpansionModel(
            initializer.getItemsState().items,
            config.expandedItems,
            config.collapsedItems
        ),
        parentProperty: config.parentProperty,
        nodeProperty: config.nodeProperty,
    };
}

/**
 * Метод для рассчета модели раскрытых узлов
 * @param items Элементы
 * @param expandedItems Раскрытые узлы
 * @param collapsedItems Свернутые узлы
 */
export function getExpansionModel(
    items?: RecordSet,
    expandedItems: TKey[] = [],
    collapsedItems: TKey[] = []
): TExpansionModel {
    const expansionModel = new Map();
    if (items) {
        const isAllExpanded = expandedItems.includes(null);
        items.forEach((item) => {
            const key = item.getKey();
            if (typeof key !== 'undefined') {
                const inExpandedItems = expandedItems.includes(key);
                const isExpandedByAllValue = isAllExpanded && !collapsedItems.includes(key);
                const expanded = inExpandedItems || isExpandedByAllValue;

                expansionModel.set(key, expanded);
            }
        });
    }
    return expansionModel;
}
