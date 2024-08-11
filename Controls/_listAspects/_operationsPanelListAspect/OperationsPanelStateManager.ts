import type { Collection as ICollection } from 'Controls/display';
import { copyOperationsPanelState, type IOperationsPanelState } from './IOperationsPanelState';
import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import { type IListChange, ListChangeNameEnum } from '../_abstractListAspect/common/ListChanges';

export class OperationsPanelStateManager extends AbstractAspectStateManager<IOperationsPanelState> {
    resolveChanges(
        prevState: Partial<IOperationsPanelState>,
        nextState: Partial<IOperationsPanelState>
    ): IListChange[] {
        const changes: IListChange[] = [];

        if (prevState.operationsPanelVisible !== nextState.operationsPanelVisible) {
            changes.push({
                name: ListChangeNameEnum.CHANGE_OPERATIONS_PANEL_VISIBILITY,
                args: {
                    visibility: nextState.operationsPanelVisible ? 'visible' : 'hidden',
                },
            });
        }

        return changes;
    }

    getNextState(state: IOperationsPanelState, changes: IListChange[]): IOperationsPanelState {
        const nextState: IOperationsPanelState = copyOperationsPanelState(state);

        changes.forEach((change) => {
            switch (change.name) {
                case ListChangeNameEnum.CHANGE_OPERATIONS_PANEL_VISIBILITY: {
                    nextState.operationsPanelVisible = change.args.visibility === 'visible';
                    break;
                }
            }
        });

        return nextState;
    }

    applyChangesToCollection(_collection: ICollection, _changes: IListChange[]): void {}
}

export function operationsPanelStateManagerFactory(): OperationsPanelStateManager {
    return new OperationsPanelStateManager();
}
