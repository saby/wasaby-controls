import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

export const markerMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:marker',
    'marker',
    [
        'setMarkerVisibility',
        'activateMarker',
        'setMarkedKey',
        'complexUpdateMarker',
        'markNearbyItem',
    ]
);
