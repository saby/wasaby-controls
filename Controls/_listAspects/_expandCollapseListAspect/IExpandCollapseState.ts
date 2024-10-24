import {
    copyStateWithHierarchyItems,
    IStateWithHierarchyItems,
} from '../_abstractListAspect/common/IStateWithHierarchyItems';
import { CrudEntityKey } from 'Types/source';
import type { TExpansionModel } from './common/TExpansionModel';

export interface IExpandCollapseState extends IStateWithHierarchyItems {
    expandedItems: CrudEntityKey[];
    collapsedItems: CrudEntityKey[];
    expansionModel: TExpansionModel;
    singleExpand?: boolean;
}

export function copyExpandCollapseState({
    expandedItems,
    collapsedItems,
    expansionModel,
    singleExpand,
    ...state
}: IExpandCollapseState): IExpandCollapseState {
    return {
        ...copyStateWithHierarchyItems(state),
        expandedItems: expandedItems,
        collapsedItems: collapsedItems,
        expansionModel: expansionModel,
        singleExpand,
    };
}
