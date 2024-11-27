import type { TKey } from 'Controls/interface';
import type { IAbstractListState } from 'Controls-DataEnv/abstractList';

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
