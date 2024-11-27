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
