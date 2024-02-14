import type { IMarkerStrategyCtor } from 'Controls/marker';
import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import type { TCollectionType } from '../../_interface/IAbstractListSliceTypes';
import type { IListChange } from '../../_interface/IListChanges';
import type { IMarkerState } from './IMarkerState';

import { IListChangeName } from '../../_interface/IListChanges';
import { AbstractAspectStateManager } from '../abstract/AbstractAspectStateManager';

// FIXME
type THandleItemClickParams = {
    columnIndex?: number;
    needSetMarkerCallback?: () => boolean;
};

function copyState(state: IMarkerState): IMarkerState {
    return {
        markedKey: state.markedKey,
        markerVisibility: state.markerVisibility,
    };
}

export class MarkerStateManager extends AbstractAspectStateManager<IMarkerState> {
    _strategy: IMarkerStrategyCtor | undefined;

    constructor({ strategy }: { strategy?: IMarkerStrategyCtor | undefined } = {}) {
        super();
        this._strategy = strategy;
    }

    resolveChanges(prevState: IMarkerState, nextState: IMarkerState): IListChange[] {
        const changes: IListChange[] = [];
        if ('markedKey' in nextState && prevState.markedKey !== nextState.markedKey) {
            // TODO . Необходимо использовать _strategy, чтобы убедиться в том, можно ли ставить маркер
            changes.push({
                name: IListChangeName.MOVE_MARKER,
                args: {
                    from: prevState.markedKey,
                    to: nextState.markedKey,
                },
            });
        }
        return changes;
    }

    getNextState(state: IMarkerState, changes: IListChange[]): IMarkerState {
        const nextState = copyState(state);

        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.MOVE_MARKER: {
                    nextState.markedKey = change.args.to;
                }
            }
        }
        return nextState;
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[]
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.MOVE_MARKER: {
                    const { from, to } = change.args;
                    if (from !== to) {
                        const item = collection.getItemBySourceKey(from);
                        if (item) {
                            item.setMarked(false);
                        }
                    }
                    const item = collection.getItemBySourceKey(to);
                    if (item) {
                        item.setMarked(true);
                    }
                }
            }
        }
    }

    handleItemClick(
        state: IMarkerState,
        key: CrudEntityKey,
        params: THandleItemClickParams = {}
    ): IMarkerState {
        const nextState = copyState(state);

        let canBeMarked = true;

        if (params.needSetMarkerCallback) {
            canBeMarked = canBeMarked && params.needSetMarkerCallback();
        }
        if (canBeMarked) {
            nextState.markedKey = key;
        }
        return nextState;
    }

    setMarker(state: IMarkerState, key: CrudEntityKey): IMarkerState {
        return {
            ...copyState(state),
            markedKey: key,
        };
    }
}

export function markerStateManagerFactory(
    collectionType: TCollectionType,
    state: IMarkerState
): MarkerStateManager {
    return new MarkerStateManager({
        // TODO: Подсунуть нужную стратегию
        strategy: undefined,
    });
}
