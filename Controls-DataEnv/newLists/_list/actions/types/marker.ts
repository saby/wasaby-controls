import type { TSingleAxisDirection } from 'Controls-DataEnv/interface';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';

//# region Экспорты для публичных типов.
export type TSetMarkedKeyAction = TAbstractListActions.marker.TSetMarkedKeyAction;
export type TMarkAction = TAbstractListActions.marker.TMarkAction;
//# endregion Экспорты для публичных типов.

/**
 * Тип действия для установки режима отображения маркера.
 */
export type TSetMarkerVisibilityAction = TAbstractAction<
    'setMarkerVisibility',
    {
        visibility?: IAbstractListState['markerVisibility'];
    }
>;

/**
 * Тип действия для попытки показать маркер.
 */
export type TActivateMarkerAction = TAbstractAction<'activateMarker', {}>;

/**
 * Тип действия для отметки ближайшей записи.
 */
export type TMarkNearbyItemAction = TAbstractAction<
    'markNearbyItem',
    {
        index: number;
    }
>;

/**
 * Тип действия для отметки следующей записи в заданном направлении.
 */
export type TMarkNextAction = TAbstractAction<
    'markNext',
    {
        direction?: TSingleAxisDirection;
    }
>;

/**
 * Тип действия для комплексного обновления маркера.
 */
export type TComplexUpdateMarkerAction = TAbstractComplexUpdateAction<'Marker'>;

/**
 * Тип действий функционала "Отметка маркером", доступные в WEB списке.
 * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
 */
export type TAnyMarkerAction =
    | TAbstractListActions.marker.TAnyMarkerAction
    | TActivateMarkerAction
    | TSetMarkerVisibilityAction
    | TComplexUpdateMarkerAction
    | TMarkNearbyItemAction
    | TMarkNextAction;
