import type { IRootState, TCollectionType } from 'Controls/dataFactory';
import type { Tree as ITree } from 'Controls/baseTree';

import { RootStateManager } from 'Controls/dataFactory';

export function rootStateManagerFactory<TCollection extends ITree>(
    collectionType: TCollectionType,
    state: IRootState
): RootStateManager<TCollection> {
    return new RootStateManager();
}
