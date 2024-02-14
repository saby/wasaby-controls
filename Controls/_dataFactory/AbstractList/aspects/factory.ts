import type { Collection as ICollection } from 'Controls/display';
import type { Tree as ITreeCollection } from 'Controls/baseTree';
import type { IAbstractListSliceState } from '../_interface/IAbstractListSliceState';
import type { TCollectionType } from '../_interface/IAbstractListSliceTypes';

import type { MarkerStateManager } from './Marker/MarkerStateManager';
import type { SelectionStateManager } from './Selection/SelectionStateManager';
import type { PathStateManager } from './Path/PathStateManager';
import type { ItemsStateManager } from './Items/ItemsStateManager';
import type { ExpandCollapseStateManager } from './ExpandCollapse/ExpandCollapseStateManager';
import type { RootStateManager } from './Root/RootStateManager';

import { markerStateManagerFactory } from './Marker/MarkerStateManager';
import { selectionStateManagerFactory } from './Selection/SelectionStateManager';
import { pathStateManagerFactory } from './Path/PathStateManager';
import { itemsStateManagerFactory } from './Items/ItemsStateManager';
import { expandCollapseStateManagerFactory } from './ExpandCollapse/ExpandCollapseStateManager';
import { rootStateManagerFactory } from './Root/RootStateManager';

export type TListAspects = {
    Marker: MarkerStateManager;
    Selection: SelectionStateManager;
    Path: PathStateManager;
    Items: ItemsStateManager;
    ExpandCollapse: ExpandCollapseStateManager<ITreeCollection>;
    Root: RootStateManager<ITreeCollection>;
};

const factories = {
    Tree: {
        Marker: markerStateManagerFactory,
        Selection: selectionStateManagerFactory,
        Path: pathStateManagerFactory,
        Items: itemsStateManagerFactory,
        ExpandCollapse: expandCollapseStateManagerFactory,
        Root: rootStateManagerFactory,
    },
    TreeGrid: {
        Marker: markerStateManagerFactory,
        Selection: selectionStateManagerFactory,
        Path: pathStateManagerFactory,
        Items: itemsStateManagerFactory,
        ExpandCollapse: expandCollapseStateManagerFactory,
        Root: rootStateManagerFactory,
    },
} as const;

export function createAspects(
    collectionType: TCollectionType,
    state: IAbstractListSliceState & {
        // TODO: Уйдет в процессе проекта, когда стратегия станет стейтлесс.
        //  Коллекция должна лежать на слайсе, а не на стейте.
        collection: ICollection;
    }
): TListAspects {
    const viewModeAspectsFactories = factories[collectionType];
    return Object.keys(viewModeAspectsFactories).reduce((aspects, name) => {
        aspects[name] = viewModeAspectsFactories[name](collectionType, state);
        return aspects;
    }, {} as TListAspects);
}
