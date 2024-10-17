import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import { IMarkerState } from '../../IMarkerState';

export type TDirection = 'Down' | 'Up' | 'Left' | 'Right' | 'Forward' | 'Backward';

export interface IMarkerStrategy<TCollection extends ICollection = ICollection> {
    getMarkedKeyByDirection: (
        state: IMarkerState,
        collection: TCollection,
        direction: TDirection
    ) => CrudEntityKey | null;
    getNextMarkedKey: (state: IMarkerState, collection: TCollection) => CrudEntityKey | null;
    getPrevMarkedKey: (state: IMarkerState, collection: TCollection) => CrudEntityKey | null;
    shouldMoveMarkerOnScrollPaging: () => boolean;

    oldGetMarkedKeyByDirection: (
        collection: TCollection,
        index: number,
        direction: TDirection
    ) => CrudEntityKey | void;
    oldGetNextMarkedKey: (collection: TCollection, index: number) => CrudEntityKey | null;
    oldGetPrevMarkedKey: (collection: TCollection, index: number) => CrudEntityKey | null;
}
