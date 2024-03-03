import type { Tree as ITree } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';
import { copyRootState, IRootState } from './IRootState';
import {
    AbstractAspectStateManager,
    IListChange,
    ListChangeNameEnum,
} from 'Controls/abstractListAspect';
import { canBeRoot } from './UILogic/canBeRoot';

export class RootStateManager<TCollection extends ITree> extends AbstractAspectStateManager<
    IRootState,
    TCollection
> {
    resolveChanges(prevState: IRootState, nextState: IRootState): IListChange[] {
        const changes: IListChange[] = [];

        if (prevState.root !== nextState.root && canBeRoot(nextState, nextState.root)) {
            changes.push({
                name: ListChangeNameEnum.CHANGE_ROOT,
                args: {
                    key: nextState.root,
                },
            });
        }
        return changes;
    }

    getNextState(state: IRootState, changes: IListChange[]): IRootState {
        const nextState = copyRootState(state);
        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.CHANGE_ROOT: {
                    nextState.root = change.args.key;
                }
            }
        }
        return nextState;
    }

    applyChangesToCollection(collection: TCollection, changes: IListChange[]): void {
        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.CHANGE_ROOT: {
                    collection.setRoot(change.args.key, true);
                }
            }
        }
    }

    changeRoot(state: IRootState, key: CrudEntityKey): IRootState {
        const nextState = copyRootState(state);
        const newRoot = canBeRoot(nextState, nextState.root) ? key : nextState.root;

        return {
            ...nextState,
            root: newRoot,
        };
    }
}

export function rootStateManagerFactory<
    TCollection extends ITree
>(): RootStateManager<TCollection> {
    return new RootStateManager();
}
