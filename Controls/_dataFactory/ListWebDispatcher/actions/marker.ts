/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from '../../interface/IListState';
import { TAbstractComplexUpdateAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractComplexUpdateAction';

export type TSetMarkedKeyAction = TAbstractAction<
    'setMarkedKey',
    {
        key: IListState['markedKey'];
    }
>;

export const setMarkedKey = (key: IListState['markedKey']): TSetMarkedKeyAction => ({
    type: 'setMarkedKey',
    payload: {
        key,
    },
});

export type TSetMarkerVisibilityAction = TAbstractAction<
    'setMarkerVisibility',
    {
        visibility: IListState['markerVisibility'];
    }
>;

export const setMarkerVisibility = (
    visibility: IListState['markerVisibility']
): TSetMarkerVisibilityAction => ({
    type: 'setMarkerVisibility',
    payload: {
        visibility,
    },
});

export type TActivateMarkerAction = TAbstractAction<'activateMarker', {}>;

export const activateMarker = (): TActivateMarkerAction => ({
    type: 'activateMarker',
    payload: {},
});

export type TComplexUpdateMarkerAction = TAbstractComplexUpdateAction<'Marker'>;

export const complexUpdateMarker = (
    prevState: IListState,
    nextState: IListState
): TComplexUpdateMarkerAction => ({
    type: 'complexUpdateMarker',
    payload: {
        prevState,
        nextState,
    },
});

export type TMarkerActions =
    | TSetMarkedKeyAction
    | TActivateMarkerAction
    | TSetMarkerVisibilityAction
    | TComplexUpdateMarkerAction;
