import dedupeArray from './utils/dedupeArray';
import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IHierarchyState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';

export default function initState(
    _: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IHierarchyState {
    return {
        root: config.root || null,
        expandedItems: dedupeArray(config.expandedItems, 'expandedItems') || [],
        collapsedItems: dedupeArray(config.collapsedItems, 'collapsedItems') || [],
        singleExpand: !!config.singleExpand,
        expansionModel: new Map(),
        parentProperty: config.parentProperty,
        nodeProperty: config.nodeProperty,
    };
}
