import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { IListState } from '../../interface/IListState';

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

export type TMarkerActions = TSetMarkerVisibilityAction;
