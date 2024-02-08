import type { CrudEntityKey } from 'Types/source';
import type { TVisibility as TBaseVisibility } from 'Controls/interface';

export type TVisibility = Extract<TBaseVisibility, 'visible' | 'hidden'> | 'onactivated';

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
