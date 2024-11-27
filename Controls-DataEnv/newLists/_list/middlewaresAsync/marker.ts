import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

/**
 * Промежуточная функция(middleware) обработки действий, связанных с отметкой записей маркером.
 */
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
