import type { TKey } from 'Controls-DataEnv/interface';
import type { source } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для загрузки предыдущей пачки данных.
 * @function
 * @return source.TLoadPrevAction
 */
export const loadPrev = (
    addItemsAfterLoad?: boolean,
    useServicePool?: boolean,
    onResolve?: Function,
    onReject?: Function
): source.TLoadPrevAction =>
    aCreator('loadPrev', {
        addItemsAfterLoad,
        useServicePool,
        onResolve,
        onReject,
    });

/**
 * Конструктор действия, для загрузки следующей пачки данных.
 * @function
 * @return source.TLoadNextAction
 */
export const loadNext = (
    addItemsAfterLoad?: boolean,
    useServicePool?: boolean,
    onResolve?: Function,
    onReject?: Function,
    key?: TKey
): source.TLoadNextAction =>
    aCreator('loadNext', {
        addItemsAfterLoad,
        useServicePool,
        onResolve,
        onReject,
        key,
    });
