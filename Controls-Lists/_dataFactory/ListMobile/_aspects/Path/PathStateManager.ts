import type { IListState, IPathState, TCollectionType } from 'Controls/dataFactory';

import { PathStateManager } from 'Controls/dataFactory';

export function pathStateManagerFactory<TState extends IPathState>(
    collectionType: TCollectionType,
    state: IListState
): PathStateManager {
    return new PathStateManager();
}
