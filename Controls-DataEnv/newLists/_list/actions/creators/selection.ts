/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls-DataEnv/interface';
import type { selection } from '../types';

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
