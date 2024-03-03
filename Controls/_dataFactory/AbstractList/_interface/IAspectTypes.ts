import type { Tree as ITreeCollection } from 'Controls/baseTree';

import type { AspectsNames } from './AspectsNames';
import type {
    expandCollapseStateManagerFactory,
    IExpandCollapseStateManager,
} from 'Controls/expandCollapseListAspect';
import type { itemsStateManagerFactory, IItemsStateManager } from 'Controls/itemsListAspect';
import type { pathStateManagerFactory, IPathStateManager } from 'Controls/pathListAspect';
import type {
    flatSelectionStateManagerFactory,
    IFlatSelectionStateManager,
} from 'Controls/flatSelectionAspect';
import type {
    hierarchySelectionStateManagerFactory,
    IHierarchySelectionStateManager,
} from 'Controls/hierarchySelectionAspect';
import type { rootStateManagerFactory, IRootStateManager } from 'Controls/rootListAspect';
import type { markerStateManagerFactory, IMarkerStateManager } from 'Controls/markerListAspect';

export type IListAspects = Map<AspectsNames.Marker, IMarkerStateManager> &
    Map<AspectsNames.Selection, IFlatSelectionStateManager | IHierarchySelectionStateManager> &
    Map<AspectsNames.Path, IPathStateManager> &
    Map<AspectsNames.Items, IItemsStateManager> &
    Map<AspectsNames.ExpandCollapse, IExpandCollapseStateManager<ITreeCollection>> &
    Map<AspectsNames.Root, IRootStateManager<ITreeCollection>>;

export type IAspectsFactory = Map<AspectsNames.Marker, typeof markerStateManagerFactory> &
    Map<
        AspectsNames.Selection,
        typeof flatSelectionStateManagerFactory | typeof hierarchySelectionStateManagerFactory
    > &
    Map<AspectsNames.Path, typeof pathStateManagerFactory> &
    Map<AspectsNames.Items, typeof itemsStateManagerFactory> &
    Map<AspectsNames.ExpandCollapse, typeof expandCollapseStateManagerFactory> &
    Map<AspectsNames.Root, typeof rootStateManagerFactory>;
