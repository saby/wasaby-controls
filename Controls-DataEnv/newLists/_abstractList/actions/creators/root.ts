import type { TKey } from 'Controls-DataEnv/interface';
import type { root } from '../types';

/**
 * Конструктор действия, для установки нового корня иерархии.
 * @function
 * @param {TKey} root Новый корень иерархии
 * @param {Boolean} processMarker Определяет будет ли обрабатываться маркер относительно нового корня иерархии
 * @return root.TSetRootAction
 */
export const setRoot = (root: TKey, processMarker: boolean = true): root.TSetRootAction => ({
    type: 'setRoot',
    payload: {
        root,
        processMarker,
    },
});
