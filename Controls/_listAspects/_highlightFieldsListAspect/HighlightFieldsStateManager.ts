import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import { IListChange } from '../_abstractListAspect/common/ListChanges';
import type { IHighlightFieldsState } from './IHighlightFieldsState';
import { copyHighlightFieldsState } from './IHighlightFieldsState';
import { HighlightedFieldsChangeName } from './THighlightFieldsChanges';
import type { Collection as ICollection } from 'Controls/display';

export class HighlightFieldsStateManager extends AbstractAspectStateManager<IHighlightFieldsState> {
    resolveChanges(
        _prevState: Partial<IHighlightFieldsState>,
        _nextState: Partial<IHighlightFieldsState>
    ): IListChange[] {
        return [];
    }

    getNextState(state: IHighlightFieldsState, changes: IListChange[]): IHighlightFieldsState {
        const nextState = copyHighlightFieldsState(state);
        for (const change of changes) {
            switch (change.name) {
                case HighlightedFieldsChangeName:
                    change.args.highlightedFieldsMap.forEach((value, key) => {
                        nextState.highlightedFieldsMap.set(key, value);
                    });
                    break;
            }
        }
        return nextState;
    }

    applyChangesToCollection(
        collection: ICollection,
        changes: IListChange[],
        _nextState: IHighlightFieldsState
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case HighlightedFieldsChangeName:
                    collection.setHighlightedFieldsModel(change.args.highlightedFieldsMap);
                    break;
            }
        }
    }
}

export function highlightFieldsStateManagerFactory(): HighlightFieldsStateManager {
    return new HighlightFieldsStateManager();
}
