import type { TKey } from 'Controls-DataEnv/interface';
import type { root } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для установки нового корня иерархии.
 */
export const setRoot = (root: TKey): root.TSetRootAction =>
    aCreator('setRoot', {
        root,
    });

/**
 * Тип действия, для изменения корня иерархии.
 */
export const changeRoot = (
    root: TKey,
    processMarker: boolean = true,
    processSearch: boolean = true
): root.TChangeRootAction =>
    aCreator('changeRoot', {
        root,
        processMarker,
        processSearch,
    });
