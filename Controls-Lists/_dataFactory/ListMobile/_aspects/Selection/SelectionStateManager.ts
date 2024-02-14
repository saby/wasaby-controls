import type { IListState, TCollectionType } from 'Controls/dataFactory';

import { SelectionStateManager } from 'Controls/dataFactory';

export function selectionStateManagerFactory(
    collectionType: TCollectionType,
    state: IListState
): SelectionStateManager {
    return new SelectionStateManager();
}
