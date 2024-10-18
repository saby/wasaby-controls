import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';

export const markerMiddleware = asyncMiddlewareFactory(
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
