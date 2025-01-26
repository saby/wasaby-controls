import type { source } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для загрузки предыдущей пачки данных.
 * @function
 * @return source.TLoadPrevAction
 */
export const loadPrev = (): source.TLoadPrevAction => aCreator('prev');

/**
 * Конструктор действия, для загрузки следующей пачки данных.
 * @function
 * @return source.TLoadNextAction
 */
export const loadNext = (): source.TLoadNextAction => aCreator('next');
