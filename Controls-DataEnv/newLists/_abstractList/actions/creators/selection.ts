/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TKey } from 'Controls/interface';
import type { selection } from '../types';

/**
 * Конструктор действия, для установки ключей выделенных записей.
 * @function
 * @param selectedKeys Ключи выделенных записей.
 * @param excludedKeys Ключи записей, исключенных из выделения.
 * @return selection.TSetSelectionAction
 */
export const setSelection = (
    selectedKeys: TKey[],
    excludedKeys: TKey[]
): selection.TSetSelectionAction => ({
    type: 'setSelection',
    payload: {
        selectedKeys,
        excludedKeys,
    },
});

/**
 * Конструктор действия, для сброса текущей отметки записей.
 * @function
 * @return selection.TResetSelectionAction
 */
export const resetSelection = (): selection.TResetSelectionAction => ({
    type: 'resetSelection',
    payload: {},
});

/**
 * Тип действий функционала "Отметка чекбоксом", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 *
 * @see https://online.sbis.ru/area/02f42333-cf50-42e8-bc08-b451cc483285 Зона Kaizen
 */
export type TSelectionActions = selection.TSetSelectionAction | selection.TResetSelectionAction;
