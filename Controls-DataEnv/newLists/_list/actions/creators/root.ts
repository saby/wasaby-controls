/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls-DataEnv/interface';
import type { root } from '../types';

/**
 * Конструктор действия, для комплексного обновления состояния текущего корня.
 */
export const complexUpdateRoot = (
    prevState: IListState,
    root: TKey | undefined
): root.TComplexUpdateRootAction => ({
    type: 'complexUpdateRoot',
    payload: {
        prevState,
        root,
    },
});
