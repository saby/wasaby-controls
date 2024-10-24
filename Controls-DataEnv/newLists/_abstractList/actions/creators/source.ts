/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { source } from '../types';

/**
 * Конструктор действия, для загрузки предыдущей пачки данных.
 * @function
 * @return source.TLoadPrevAction
 */
export const loadPrev = (): source.TLoadPrevAction => ({
    type: 'prev',
    payload: {},
});

/**
 * Конструктор действия, для загрузки следующей пачки данных.
 * @function
 * @return source.TLoadNextAction
 */
export const loadNext = (): source.TLoadNextAction => ({
    type: 'next',
    payload: {},
});
