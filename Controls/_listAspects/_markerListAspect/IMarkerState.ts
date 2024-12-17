import type { CrudEntityKey } from 'Types/source';
import type { TVisibility } from './common/types';

export interface IMarkerState {
    markerVisibility?: TVisibility;
    markedKey?: CrudEntityKey | null;
}

export function copyMarkerState({ markedKey, markerVisibility }: IMarkerState): IMarkerState {
    return {
        markedKey,
        markerVisibility,
    };
}
