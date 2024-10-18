/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TKey } from 'Controls-DataEnv/interface';
import type { selection } from '../types';
import type { CrudEntityKey } from 'Types/source';

// TODO: Перенести в Web, тут не надо
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
 * Конструктор действия, для отметки записи с помощью множественного выделения.
 * @function
 * @param {CrudEntityKey} key Ключ записи.
 * @param {'backward' | 'forward'} direction Направление движения при последовательной отметке записей.
 * @return selection.TSelectAction
 */
export const select = (
    key: CrudEntityKey,
    direction?: 'backward' | 'forward'
): selection.TSelectAction => ({
    type: 'select',
    payload: {
        key,
        direction,
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
 * Конструктор действия, для отметки всех записей.
 * @function
 * @return selection.TSelectAllAction
 */
export const selectAll = (): selection.TSelectAllAction => ({
    type: 'selectAll',
    payload: {},
});

/**
 * Конструктор действия, для инверртирования состояния выбора записей.
 * @function
 * @return selection.TInvertSelectionAction
 */
export const invertSelection = (): selection.TInvertSelectionAction => ({
    type: 'invertSelection',
    payload: {},
});
