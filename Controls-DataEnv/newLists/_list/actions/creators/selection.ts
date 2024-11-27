import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls-DataEnv/interface';
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
 * Конструктор действия, для установки видимости множественного выделения.
 */
export const setSelectionVisibility = (
    visibility: IListState['multiSelectVisibility']
): selection.TSetSelectionVisibilityAction => ({
    type: 'setSelectionVisibility',
    payload: {
        visibility,
    },
});

/**
 * Конструктор действия, для комплексного обновления состояния выделения.
 */
export const updateSelection = (
    prevState: IListState,
    selectedKeys: TKey[],
    excludedKeys: TKey[]
): selection.TUpdateSelectionAction => ({
    type: 'updateSelection',
    payload: {
        prevState,
        selectedKeys,
        excludedKeys,
    },
});
