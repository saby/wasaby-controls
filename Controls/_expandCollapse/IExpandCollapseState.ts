import type { IListState } from 'Controls-DataEnv/list';

export interface IExpandCollapseState
    extends Pick<
        IListState,
        | 'expandedItems'
        | 'collapsedItems'
        | 'expansionModel'
        | 'singleExpand'
        | 'parentProperty'
        | 'nodeProperty'
        | 'declaredChildrenProperty'
        | 'items'
        | 'keyProperty'
    > {}

export function copyExpandCollapseState({
    expandedItems,
    collapsedItems,
    expansionModel,
    singleExpand,
    nodeProperty,
    parentProperty,
    declaredChildrenProperty,
    keyProperty,
    items,
}: IExpandCollapseState): IExpandCollapseState {
    return {
        keyProperty,
        items,
        nodeProperty,
        parentProperty,
        declaredChildrenProperty,
        expandedItems,
        collapsedItems,
        expansionModel,
        singleExpand,
    };
}
