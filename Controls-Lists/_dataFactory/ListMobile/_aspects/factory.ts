import type { TListAspects, TCollectionType, IListState } from 'Controls/dataFactory';

import { markerStateManagerFactory } from './Marker/MarkerStateManager';
import { selectionStateManagerFactory } from './Selection/SelectionStateManager';
import { pathStateManagerFactory } from './Path/PathStateManager';
import { itemsStateManagerFactory } from './Items/ItemsStateManager';
import { rootStateManagerFactory } from './Root/RootStateManager';
import { expandCollapseStateManagerFactory } from './ExpandCollapse/ExpandCollapseStateManager';

export function createAspects(collectionType: TCollectionType, state: IListState): TListAspects {
    return {
        Items: itemsStateManagerFactory(collectionType, state),
        Marker: markerStateManagerFactory(collectionType, state),
        Selection: selectionStateManagerFactory(collectionType, state),
        Path: pathStateManagerFactory(collectionType, state),
        ExpandCollapse: expandCollapseStateManagerFactory(collectionType, state),
        Root: rootStateManagerFactory(collectionType, state),
    };
}
