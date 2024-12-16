import type { IListState } from '../../interface/IListState';
import type { root } from '../types';

/**
 * Конструктор действия, для комплексного обновления состояния текущего корня.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return root.TComplexUpdateRootAction
 */
export const complexUpdateRoot = (
    prevState: IListState,
    nextState: IListState
): root.TComplexUpdateRootAction => ({
    type: 'complexUpdateRoot',
    payload: {
        prevState,
        nextState,
    },
});
