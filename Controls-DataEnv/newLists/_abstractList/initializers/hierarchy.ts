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
        expandedItems: config.expandedItems || [],
        collapsedItems: config.collapsedItems || [],
        singleExpand: !!config.singleExpand,
        expansionModel: new Map(),
        parentProperty: config.parentProperty,
        nodeProperty: config.nodeProperty,
    };
}
