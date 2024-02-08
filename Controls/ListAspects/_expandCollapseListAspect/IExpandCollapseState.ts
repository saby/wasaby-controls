import { copyStateWithHierarchyItems, IStateWithHierarchyItems } from 'Controls/abstractListAspect';
import { TKey } from 'Controls/interface';

export interface IExpandCollapseState extends IStateWithHierarchyItems {
    expandedItems: TKey[];
    collapsedItems: TKey[];
    singleExpand?: boolean;
}

export function copyExpandCollapseState({
    expandedItems,
    collapsedItems,
    singleExpand,
    ...state
}: IExpandCollapseState): IExpandCollapseState {
    return {
        ...copyStateWithHierarchyItems(state),
        expandedItems,
        collapsedItems,
        singleExpand,
    };
}
