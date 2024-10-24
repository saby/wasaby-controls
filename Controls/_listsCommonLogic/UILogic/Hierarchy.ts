import type { TKey } from 'Controls/interface';
import type { IAbstractListState } from 'Controls-DataEnv/abstractList';
import { relation as entityRelation } from 'Types/entity';

// TODO: Переделать проверку на ExpansionMap, когда она будет создаваться везде.
//  Проверка по данным неверна, т.к. это не ответственность ViewModel.
export function isExpanded(state: IAbstractListState, key: TKey): boolean {
    const { expandedItems, collapsedItems } = state;
    if (!expandedItems || !collapsedItems) {
        return false;
    }
    return expandedItems.includes(key) || (isExpandAll(state) && !collapsedItems.includes(key));
}

export const ALL_EXPANDED_VALUE = null;

export function isExpandAll({ expandedItems }: IAbstractListState): boolean {
    return expandedItems[0] === ALL_EXPANDED_VALUE;
}

export function canBeRoot(
    viewModelState: IAbstractListState,
    key: TKey,
    relation: entityRelation.Hierarchy = new entityRelation.Hierarchy(viewModelState)
): boolean {
    return (
        relation.getRootKey() === key ||
        isNode(viewModelState, key, relation) ||
        !viewModelState.items.getRecordById(key)
    );
}

export function isNode(
    viewModelState: IAbstractListState,
    key: TKey,
    relation: entityRelation.Hierarchy = new entityRelation.Hierarchy(viewModelState)
): boolean {
    const item = viewModelState.items && viewModelState.items.getRecordById(key);
    return item && relation.isNode(item) !== null;
}
