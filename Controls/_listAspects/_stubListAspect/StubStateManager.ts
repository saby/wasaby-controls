import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import { IListChange } from '../_abstractListAspect/common/ListChanges';
import { copyStubState, type IStubState } from './IStubState';
import { AddStubChangeName, RemoveStubChangeName } from './TSStubChanges';
import type { Collection as ICollection } from 'Controls/display';

export class StubStateManager extends AbstractAspectStateManager<IStubState> {
    resolveChanges(
        _prevState: Partial<IStubState>,
        _nextState: Partial<IStubState>
    ): IListChange[] {
        return [];
    }

    getNextState(state: IStubState, changes: IListChange[]): IStubState {
        const nextState = copyStubState(state);
        for (const change of changes) {
            switch (change.name) {
                case AddStubChangeName:
                    nextState.needShowStub = true;
                    break;
                case RemoveStubChangeName:
                    nextState.needShowStub = false;
                    break;
            }
        }
        return nextState;
    }

    applyChangesToCollection(
        _collection: ICollection,
        _changes: IListChange[],
        _nextState: IStubState
    ): void {}
}

export function stubStateManagerFactory(): StubStateManager {
    return new StubStateManager();
}
