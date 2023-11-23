import type { IListState, TCollectionType } from 'Controls/dataFactory';

import { MarkerStateManager } from 'Controls/dataFactory';

export function markerStateManagerFactory(
    collectionType: TCollectionType,
    state: IListState
): MarkerStateManager {
    return new MarkerStateManager();
}
