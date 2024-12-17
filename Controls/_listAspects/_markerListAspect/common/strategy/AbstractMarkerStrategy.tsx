import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import type { IMarkerStrategy, TDirection } from './IMarkerStrategy';
import type { IMarkerState } from '../../IMarkerState';

export type { TDirection };

export interface IAbstractMarkerStrategyProps {
    moveMarkerOnScrollPaging?: boolean;
}

function getFirstItemKey(collection: ICollection): CrudEntityKey | null {
    if (!collection.getCount()) {
        return null;
    }

    const markableItem = collection.getFirst('Markable');
    return markableItem?.key;
}

export abstract class AbstractMarkerStrategy<TCollection extends ICollection>
    implements IMarkerStrategy<TCollection>
{
    protected readonly _moveMarkerOnScrollPaging: boolean;

    constructor({ moveMarkerOnScrollPaging }: IAbstractMarkerStrategyProps = {}) {
        this._moveMarkerOnScrollPaging = moveMarkerOnScrollPaging !== false;
    }

    getMarkedKeyByDirection(
        state: IMarkerState,
        collection: TCollection,
        direction: TDirection
    ): CrudEntityKey | null {
        return this._wrapInValidReturn(state, collection, (index) =>
            this._getMarkedKeyByDirection(collection, index, direction)
        );
    }

    getNextMarkedKey(state: IMarkerState, collection: TCollection): CrudEntityKey | null {
        return this._wrapInValidReturn(state, collection, (index) =>
            this._getNextMarkedKey(collection, index)
        );
    }

    getPrevMarkedKey(state: IMarkerState, collection: TCollection): CrudEntityKey | null {
        return this._wrapInValidReturn(state, collection, (index) =>
            this._getPrevMarkedKey(collection, index)
        );
    }

    protected abstract _getMarkedKeyByDirection(
        collection: TCollection,
        index: number,
        direction: TDirection
    ): CrudEntityKey | null;

    protected abstract _getNextMarkedKey(
        collection: TCollection,
        index: number
    ): CrudEntityKey | null;

    protected abstract _getPrevMarkedKey(
        collection: TCollection,
        index: number
    ): CrudEntityKey | null;

    abstract shouldMoveMarkerOnScrollPaging(): boolean;

    private _wrapInValidReturn(
        state: IMarkerState,
        collection: TCollection,
        cb: (index: number) => CrudEntityKey | null
    ): CrudEntityKey | null {
        const { markedKey } = state;
        if (markedKey === undefined || markedKey === null) {
            return getFirstItemKey(collection);
        }

        const index = collection.getIndex(collection.getItemBySourceKey(markedKey));
        const nextMarkedKey = cb(index);
        return nextMarkedKey === null ? markedKey : nextMarkedKey;
    }
}
