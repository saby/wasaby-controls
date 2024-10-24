import type { Collection as ICollection } from 'Controls/display';
import { calculatePath } from 'Controls/dataSource';
import { copyPathState, IPathState } from './IPathState';
import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import { IListChange } from '../_abstractListAspect/common/ListChanges';
import { ListChangeNameEnum } from '../_abstractListAspect/common/ListChanges';
import { fixStateWithItems } from '../_abstractListAspect/common/IStateWithItems';

export class PathStateManager extends AbstractAspectStateManager<IPathState> {
    resolveChanges(prevState: IPathState, nextState: IPathState): IListChange[] {
        const changes: IListChange[] = [];
        if ('items' in nextState && nextState.items) {
            const prevMetaData = prevState.items?.getMetaData?.();
            const nextMetaData = nextState.items.getMetaData();
            if (prevMetaData?.path !== nextMetaData?.path) {
                changes.push({
                    name: ListChangeNameEnum.REPLACE_PATH,
                    args: {
                        path: nextMetaData?.path ?? null,
                        owner: nextState.items,
                    },
                });
            }
        }
        return changes;
    }

    getNextState(state: IPathState, changes: IListChange[]): IPathState {
        const nextState: IPathState = copyPathState(state);

        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.REPLACE_PATH: {
                    const { path, backButtonCaption, backButtonItem } = calculatePath(
                        change.args.owner,
                        state.displayProperty
                    );

                    nextState.breadCrumbsItems = path;
                    nextState.backButtonCaption = backButtonCaption || '';
                    nextState.backButtonItem = backButtonItem;
                    break;
                }
            }
        }

        return fixStateWithItems(nextState) as IPathState;
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[]
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.REPLACE_PATH: {
                    const { path } = change.args;
                    const recordSet = collection.getSourceCollection();
                    recordSet.setMetaData({ ...recordSet.getMetaData(), path });
                    break;
                }
            }
        }
    }
}

export function pathStateManagerFactory(): PathStateManager {
    return new PathStateManager();
}
