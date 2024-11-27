import type { CrudEntityKey } from 'Types/source';
import type { marker } from '../types';

/**
 * Конструктор действия для отметки записи маркером.
 * @function
 * @param {CrudEntityKey | null | undefined} key Ключ записи
 * @return marker.TSetMarkedKeyAction
 */
export const setMarkedKey = (
    key: CrudEntityKey | null | undefined
): marker.TSetMarkedKeyAction => ({
    type: 'setMarkedKey',
    payload: {
        key,
    },
});
