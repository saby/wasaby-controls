import type { error } from '../types';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Конструктор действия, для обработки ошибки загрузки.
 * @function
 * @param {Error} error Объект ошибки
 * @param {string} direction Направление загрузки
 * @param {string|number|null} loadKey Ключ узла, для которого происходила загрузка данных
 * @param {Function} action Воспроизводит действие, которое привело к ошибке
 * @return error.THandleLoadErrorAction
 */
export const handleLoadError = (
    error: Error,
    direction?: 'up' | 'down',
    loadKey?: TKey,
    action?: () => void
): error.THandleLoadErrorAction => ({
    type: 'handleLoadError',
    payload: {
        error,
        direction,
        loadKey,
        action,
    },
});
