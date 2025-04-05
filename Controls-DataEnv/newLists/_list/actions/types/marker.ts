import type { TKey, TSingleAxisDirection } from 'Controls-DataEnv/interface';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { IAbstractListState, TAbstractListActions } from 'Controls-DataEnv/abstractList';

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
        key?: TKey;
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
 * Тип действий функционала "Отметка маркером", доступные в WEB списке.
 * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
 */
export type TAnyMarkerAction =
    | TAbstractListActions.marker.TAnyMarkerAction
    | TActivateMarkerAction
    | TSetMarkerVisibilityAction
    | TMarkNearbyItemAction
    | TMarkNextAction;
