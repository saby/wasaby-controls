/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListState } from '../interface/IListState';
import { _private_predicates } from 'Controls-DataEnv/abstractList';
const { isString } = _private_predicates;

/**
 * Функция определяет, поддерживает ли текущий стейт иерархию.
 * @param state Стейт слайса
 * @return boolean
 * @remark Будет удалена вместе с Slice.isExpanded и Slice.isExpandAll
 */
export function isStateHierarchy(state: IListState): boolean {
    return (
        isString(state.keyProperty) &&
        isString(state.parentProperty) &&
        isString(state.nodeProperty)
    );
}
