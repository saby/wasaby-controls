import type { TKey } from 'Controls/interface';
import type { TVisibility } from 'Controls/marker';

export interface IMarkerState {
    markerVisibility?: TVisibility;
    markedKey?: TKey;
}
