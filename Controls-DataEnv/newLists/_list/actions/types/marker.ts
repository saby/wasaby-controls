/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/abstractDispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import type { MarkerDirection } from 'Controls/interface';

/**
 * Тип действия, для отметки записи маркером.
 */
export type TSetMarkedKeyAction = TAbstractListActions.marker.TSetMarkedKeyAction;

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
