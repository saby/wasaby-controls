import type { IListState } from '../../interface/IListState';
import type { marker } from '../types';
import type { TSingleAxisDirection } from 'Controls-DataEnv/interface';

/**
 * Конструктор действия для установки режима отображения маркера.
 * @function
 * @param {"visible" | "hidden" | "onactivated"} visibility Режим отображения
 * @return marker.TSetMarkerVisibilityAction
 */
export const setMarkerVisibility = (
    visibility?: IListState['markerVisibility']
): marker.TSetMarkerVisibilityAction => ({
    type: 'setMarkerVisibility',
    payload: {
        visibility,
    },
});

/**
 * Конструктор действия для попытки показать маркер.
 * @function
 * @return marker.TActivateMarkerAction
 */
export const activateMarker = (): marker.TActivateMarkerAction => ({
    type: 'activateMarker',
    payload: {},
});

/**
 * Конструктор действия для отметки ближайшей записи.
 * @function
 * @param {number} index Индекс записи
 * @return marker.TMarkNearbyItemAction
 */
export const markNearbyItem = (index: number): marker.TMarkNearbyItemAction => ({
    type: 'markNearbyItem',
    payload: {
        index,
    },
});

/**
 * Конструктор действия для отметки следующей записи в заданном направлении.
 */
export const markNext = (direction?: TSingleAxisDirection): marker.TMarkNextAction => ({
    type: 'markNext',
    payload: {
        direction,
    },
});
