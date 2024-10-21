/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import type { MarkerDirection } from 'Controls/interface';
import { marker } from 'Controls-DataEnv/newLists/_list/actions/types';

// Экспорты для публичных типов.
/**
 * Тип действия, для отметки записи маркером.
 */
export type TSetMarkedKeyAction = TAbstractListActions.marker.TSetMarkedKeyAction;
// Экспорты для публичных типов.

/**
 * Тип действия, для установки режима отображения маркера.
 */
export type TSetMarkerVisibilityAction = TAbstractAction<
    'setMarkerVisibility',
    {
        visibility: IListState['markerVisibility'];
    }
>;

/**
 * Тип действия, для попытки показать маркер.
 */
export type TActivateMarkerAction = TAbstractAction<'activateMarker', {}>;

/**
 * Тип действия, для отметки ближайшей записи.
 */
export type TMarkNearbyItemAction = TAbstractAction<
    'markNearbyItem',
    {
        index: number;
    }
>;

/**
 * Тип действия, для отметки следующей записи в заданном направлении.
 */
export type TMarkNextAction = TAbstractAction<
    'markNext',
    {
        direction?: MarkerDirection;
    }
>;

/**
 * Тип действия, для комплексного обновления маркера.
 */
export type TComplexUpdateMarkerAction = TAbstractComplexUpdateAction<'Marker'>;

/**
 * Тип действий функционала "Отметка маркером", доступные в WEB списке.
 * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
 */
export type TAnyMarkerAction =
    | TAbstractListActions.marker.TAnyMarkerAction
    | marker.TActivateMarkerAction
    | marker.TSetMarkerVisibilityAction
    | marker.TComplexUpdateMarkerAction
    | marker.TMarkNearbyItemAction
    | marker.TMarkNextAction;
