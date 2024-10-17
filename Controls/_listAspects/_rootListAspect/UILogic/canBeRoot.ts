import {
    copyStateWithHierarchyItems,
    IStateWithHierarchyItems,
} from '../../_abstractListAspect/common/IStateWithHierarchyItems';
import { relation as entityRelation } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

export function canBeRoot(state: IStateWithHierarchyItems, key: CrudEntityKey): boolean {
    const hierarchyProps = copyStateWithHierarchyItems(state);
    const relation = new entityRelation.Hierarchy(hierarchyProps);
    const itemToCheck = state.items.getRecordById(key);
    return relation.getRootKey() === key || !itemToCheck || relation.isNode(itemToCheck) !== null;
}
