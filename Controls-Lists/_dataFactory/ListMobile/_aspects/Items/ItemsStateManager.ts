import type { IListState, TCollectionType } from 'Controls/dataFactory';

import { ItemsStateManager } from 'Controls/dataFactory';

export function itemsStateManagerFactory(
    collectionType: TCollectionType,
    state: IListState
): ItemsStateManager {
    return new ItemsStateManager();
}
