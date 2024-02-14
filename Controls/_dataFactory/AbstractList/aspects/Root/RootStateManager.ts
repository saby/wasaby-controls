import type { Tree as ITree } from 'Controls/baseTree';
import type { IRootState } from './IRootState';
import type { TCollectionType } from '../../_interface/IAbstractListSliceTypes';
import type { IListChange } from '../../../AbstractList/_interface/IListChanges';

import { relation } from 'Types/entity';
import { IListChangeName } from '../../../AbstractList/_interface/IListChanges';
import { AbstractAspectStateManager } from '../abstract/AbstractAspectStateManager';

function getHierarchyRelation(state: IRootState): relation.Hierarchy {
    return new relation.Hierarchy({
        parentProperty: state.parentProperty,
        nodeProperty: state.nodeProperty,
        keyProperty: state.keyProperty,
        declaredChildrenProperty: state.declaredChildrenProperty,
    });
}

export class RootStateManager<TCollection extends ITree> extends AbstractAspectStateManager<
    IRootState,
    TCollection
> {
    resolveChanges(prevState: IRootState, nextState: IRootState): IListChange[] {
        const changes: IListChange[] = [];

        const isNode = () => {
            const relation = getHierarchyRelation(nextState);
            const newRootItem = nextState.items.getRecordById(nextState.root);
            return (
                relation.getRootKey() === nextState.root ||
                (newRootItem && relation.isNode(newRootItem) !== null)
            );
        };

        if (prevState.root !== nextState.root && isNode()) {
            changes.push({
                name: IListChangeName.CHANGE_ROOT,
                args: {
                    key: nextState.root,
                },
            });
        }
        return changes;
    }

    getNextState(state: IRootState, changes: IListChange[]): IRootState {
        const nextState: IRootState = {
            root: state.root,
            keyProperty: state.keyProperty,
            nodeProperty: state.nodeProperty,
            parentProperty: state.parentProperty,
            declaredChildrenProperty: state.declaredChildrenProperty,
        };
        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.CHANGE_ROOT: {
                    nextState.root = change.args.key;
                }
            }
        }
        return nextState;
    }

    applyChangesToCollection(collection: TCollection, changes: IListChange[]): void {
        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.CHANGE_ROOT: {
                    collection.setRoot(change.args.key, true);
                }
            }
        }
    }
}

export function rootStateManagerFactory<TCollection extends ITree>(
    collectionType: TCollectionType,
    state: IRootState
): RootStateManager<TCollection> {
    return new RootStateManager();
}
