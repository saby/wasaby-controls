import type { CrudEntityKey } from 'Types/source';
import { copyStateWithHierarchyItems, IStateWithHierarchyItems } from 'Controls/abstractListAspect';

export interface IRootState extends IStateWithHierarchyItems {
    root: CrudEntityKey | null;
}

export function copyRootState({ root, ...state }: IRootState): IRootState {
    return {
        ...copyStateWithHierarchyItems(state),
        root,
    };
}
