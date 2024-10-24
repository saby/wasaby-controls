/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TKey } from 'Controls-DataEnv/interface';
import type { root } from '../types';

/**
 * Конструктор действия, для смены текущего корня иерархии.
 * @function
 * @param {TKey} root Новый корень иерархии
 * @return root.TSetRootAction
 */
export const setRoot = (root: TKey): root.TSetRootAction => ({
    type: 'setRoot',
    payload: {
        root,
    },
});
