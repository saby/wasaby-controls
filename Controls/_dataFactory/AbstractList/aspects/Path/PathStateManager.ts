import type { Collection as ICollection } from 'Controls/display';
import type { IPathState } from './IPathState';
import type { IListChange } from '../../_interface/IListChanges';
import type { TCollectionType } from '../../_interface/IAbstractListSliceTypes';

import { calculatePath } from 'Controls/dataSource';
import { IListChangeName } from '../../_interface/IListChanges';
import { AbstractAspectStateManager } from '../abstract/AbstractAspectStateManager';

export class PathStateManager extends AbstractAspectStateManager<IPathState> {
    resolveChanges(prevState: IPathState, nextState: IPathState): IListChange[] {
        const changes: IListChange[] = [];
        const prevMetaData = prevState.items.getMetaData();
        if ('items' in nextState) {
            const nextMetaData = nextState.items.getMetaData();
            if (prevMetaData?.path !== nextMetaData?.path) {
                changes.push({
                    name: IListChangeName.REPLACE_PATH,
                    args: {
                        path: nextMetaData?.path ?? null,
                    },
                });
            }
        }
        return changes;
    }

    getNextState(state: IPathState, changes: IListChange[]): IPathState {
        const nextState: IPathState = {
            items: state.items,
            displayProperty: state.displayProperty,
            backButtonCaption: state.displayProperty,
            backButtonItem: state.backButtonItem,
            breadCrumbsItemsWithoutBackButton: state.breadCrumbsItemsWithoutBackButton,
            breadCrumbsItems: state.breadCrumbsItems,
        };

        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.REPLACE_PATH: {
                    const { path, backButtonCaption, backButtonItem } = calculatePath(
                        change.args.path,
                        state.displayProperty
                    );

                    nextState.breadCrumbsItems = path;
                    nextState.backButtonCaption = backButtonCaption;
                    nextState.backButtonItem = backButtonItem;
                    break;
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
                case IListChangeName.REPLACE_PATH: {
                    const { path } = change.args;
                    const recordSet = collection.getSourceCollection();
                    recordSet.setMetaData({ ...recordSet.getMetaData(), path });
                    break;
                }
            }
        }
    }
}

export function pathStateManagerFactory(
    collectionType: TCollectionType,
    state: IPathState
): PathStateManager {
    return new PathStateManager();
}
