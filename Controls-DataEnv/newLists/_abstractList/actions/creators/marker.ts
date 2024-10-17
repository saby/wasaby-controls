/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { CrudEntityKey } from 'Types/source';
import type { marker } from '../types';

/**
 * Конструктор действия, для отметки записи маркером.
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

/**
 * Тип действий функционала "Отметка маркером", доступные в любом списке, независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
 */
export type TMarkerActions = marker.TSetMarkedKeyAction;
