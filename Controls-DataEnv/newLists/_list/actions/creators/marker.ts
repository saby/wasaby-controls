/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AbstractListActionCreators } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { marker } from '../types';
import type { MarkerDirection } from 'Controls/interface';

/**
 * Конструктор действия, для отметки записи маркером.
 * @function
 * @param {CrudEntityKey | null | undefined} key Ключ записи
 * @return marker.TSetMarkedKeyAction
 */
export const setMarkedKey = AbstractListActionCreators.marker.setMarkedKey;

/**
 * Конструктор действия, для установки режима отображения маркера.
 * @function
 * @param {"visible" | "hidden" | "onactivated"} visibility Режим отображения
 * @return marker.TSetMarkerVisibilityAction
 */
export const setMarkerVisibility = (
    visibility: IListState['markerVisibility']
): marker.TSetMarkerVisibilityAction => ({
    type: 'setMarkerVisibility',
    payload: {
        visibility,
    },
});

/**
 * Конструктор действия, для попытки показать маркер.
 * @function
 * @return marker.TActivateMarkerAction
 */
export const activateMarker = (): marker.TActivateMarkerAction => ({
    type: 'activateMarker',
    payload: {},
});

/**
 * Конструктор действия, для отметки ближайшей записи.
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
 * Конструктор действия, для отметки следующей записи в заданном направлении.
 * @function
 * @param {MarkerDirection | undefined} direction Направление
 * @return marker.TMarkNextAction
 */
export const markNext = (direction?: MarkerDirection): marker.TMarkNextAction => ({
    type: 'markNext',
    payload: {
        direction,
    },
});

/**
 * Конструктор действия, для комплексного обновления маркера.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return marker.TComplexUpdateMarkerAction
 */
export const complexUpdateMarker = (
    prevState: IListState,
    nextState: IListState
): marker.TComplexUpdateMarkerAction => ({
    type: 'complexUpdateMarker',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Тип действий функционала "Отметка маркером".
 * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
 */
export type TMarkerActions =
    | marker.TSetMarkedKeyAction
    | marker.TActivateMarkerAction
    | marker.TSetMarkerVisibilityAction
    | marker.TComplexUpdateMarkerAction
    | marker.TMarkNearbyItemAction
    | marker.TMarkNextAction;
