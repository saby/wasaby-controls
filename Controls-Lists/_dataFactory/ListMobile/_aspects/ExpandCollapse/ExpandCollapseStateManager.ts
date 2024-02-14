import type { Tree as ITree } from 'Controls/baseTree';
import type { IListState, TCollectionType } from 'Controls/dataFactory';

import { ExpandCollapseStateManager } from 'Controls/dataFactory';

export function expandCollapseStateManagerFactory<TCollection extends ITree>(
    collectionType: TCollectionType,
    state: IListState
): ExpandCollapseStateManager<TCollection> {
    return new ExpandCollapseStateManager<TCollection>();
}
