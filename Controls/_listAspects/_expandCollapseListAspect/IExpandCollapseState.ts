import {
    copyStateWithHierarchyItems,
    IStateWithHierarchyItems,
} from '../_abstractListAspect/common/IStateWithHierarchyItems';
import type { IAbstractListState } from 'Controls-DataEnv/abstractList';

export interface IExpandCollapseState
    extends IStateWithHierarchyItems,
        Pick<
            IAbstractListState,
            'expandedItems' | 'collapsedItems' | 'expansionModel' | 'singleExpand'
        > {}

export function copyExpandCollapseState({
    expandedItems,
    collapsedItems,
    expansionModel,
    singleExpand,
    ...state
}: IExpandCollapseState): IExpandCollapseState {
    return {
        ...copyStateWithHierarchyItems(state),
        expandedItems,
        collapsedItems,
        expansionModel,
        singleExpand,
    };
}
