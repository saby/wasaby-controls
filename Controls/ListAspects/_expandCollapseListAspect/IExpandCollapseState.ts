import { copyStateWithHierarchyItems, IStateWithHierarchyItems } from 'Controls/abstractListAspect';
import { CrudEntityKey } from 'Types/source';

export interface IExpandCollapseState extends IStateWithHierarchyItems {
    expandedItems: CrudEntityKey[];
    collapsedItems: CrudEntityKey[];
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
