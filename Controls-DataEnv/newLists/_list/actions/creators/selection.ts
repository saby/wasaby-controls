import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls-DataEnv/interface';
import type { selection } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для установки видимости множественного выделения.
 */
export const setSelectionVisibility = (
    visibility: IListState['multiSelectVisibility']
): selection.TSetSelectionVisibilityAction =>
    aCreator('setSelectionVisibility', {
        visibility,
    });

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
): selection.TSetSelectionAction =>
    aCreator('setSelection', {
        selectedKeys,
        excludedKeys,
    });

/**
 * Конструктор действия, для обновления счетчика выделенных записей
 */
export const updateCounter = (): selection.TUpdateCounterAction => aCreator('updateCounter', {});
