/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TKey } from 'Controls/interface';
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

/**
 * Тип действий функционала "Проваливание", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/f77b7722-2f7f-4c69-b029-a00480c0d33b Зона Kaizen
 */
export type TRootActions = root.TSetRootAction;
