import { relation as entityRelation } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { copyStateWithHierarchyItems, IStateWithHierarchyItems } from 'Controls/abstractListAspect';

export function canBeRoot(state: IStateWithHierarchyItems, key: CrudEntityKey): boolean {
    const relation = new entityRelation.Hierarchy(copyStateWithHierarchyItems(state));
    const itemToCheck = state.items.getRecordById(key);
    return relation.getRootKey() === key || !itemToCheck || relation.isNode(itemToCheck) !== null;
}
