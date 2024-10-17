import { relation } from 'Types/entity';
import {
    IStateWithHierarchyItems,
    copyStateWithHierarchyItems,
} from '../../IStateWithHierarchyItems';
import type { CrudEntityKey } from 'Types/source';

export function isNode(_state: IStateWithHierarchyItems, key: CrudEntityKey): boolean {
    const state = copyStateWithHierarchyItems(_state);
    const item = state.items && state.items.getRecordById(key);
    return item && new relation.Hierarchy(state).isNode(item) !== null;
}
