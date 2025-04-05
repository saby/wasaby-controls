import { hooks, type hooks as THookTypes } from 'Controls/listsCommonLogic';

export type ItemStates = THookTypes.ItemStates;
export const useObservableItemStates = hooks.useObservableItemStates;

/**
 * Хук для получения состояния записи списка (marked, selected)
 * @param watchedStates
 */
export function useItemState(watchedStates: hooks.ItemState[]): ItemStates {
    return hooks.useItemState(watchedStates);
}
