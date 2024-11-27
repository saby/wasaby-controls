/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Tree as ITreeCollection } from 'Controls/baseTree';

import type { AspectsNames } from './AspectsNames';
import type {
    expandCollapseStateManagerFactory,
    IExpandCollapseStateManager,
} from 'Controls/listAspects';
import type { IItemsStateManager, itemsStateManagerFactory } from 'Controls/listAspects';
import type { IPathStateManager, pathStateManagerFactory } from 'Controls/listAspects';
import type {
    flatSelectionStateManagerFactory,
    IFlatSelectionStateManager,
} from 'Controls/listAspects';
import type {
    hierarchySelectionStateManagerFactory,
    IHierarchySelectionStateManager,
} from 'Controls/listAspects';
import type { IRootStateManager, rootStateManagerFactory } from 'Controls/listAspects';
import type { IMarkerStateManager, markerStateManagerFactory } from 'Controls/listAspects';
import type {
    IOperationsPanelStateManager,
    operationsPanelStateManagerFactory,
} from 'Controls/listAspects';
import type {
    highlightFieldsStateManagerFactory,
    IHighlightFieldsStateManager,
} from 'Controls/listAspects';
import type {
    IItemActionsStateManager,
    itemActionsStateManagerFactory,
} from 'Controls/listAspects';
import type { IStubStateManager, stubStateManagerFactory } from 'Controls/listAspects';

export type IListAspects = Map<AspectsNames.Marker, IMarkerStateManager> &
    Map<AspectsNames.Selection, IFlatSelectionStateManager | IHierarchySelectionStateManager> &
    Map<AspectsNames.Path, IPathStateManager> &
    Map<AspectsNames.Items, IItemsStateManager> &
    Map<AspectsNames.ExpandCollapse, IExpandCollapseStateManager<ITreeCollection>> &
    Map<AspectsNames.Root, IRootStateManager<ITreeCollection>> &
    Map<AspectsNames.HighlightFields, IHighlightFieldsStateManager> &
    Map<AspectsNames.OperationsPanel, IOperationsPanelStateManager> &
    Map<AspectsNames.ItemActions, IItemActionsStateManager> &
    Map<AspectsNames.Stub, IStubStateManager>;

export type IAspectsFactory = Map<AspectsNames.Marker, typeof markerStateManagerFactory> &
    Map<
        AspectsNames.Selection,
        typeof flatSelectionStateManagerFactory | typeof hierarchySelectionStateManagerFactory
    > &
    Map<AspectsNames.Path, typeof pathStateManagerFactory> &
    Map<AspectsNames.Items, typeof itemsStateManagerFactory> &
    Map<AspectsNames.ExpandCollapse, typeof expandCollapseStateManagerFactory> &
    Map<AspectsNames.Root, typeof rootStateManagerFactory> &
    Map<AspectsNames.HighlightFields, typeof highlightFieldsStateManagerFactory> &
    Map<AspectsNames.OperationsPanel, typeof operationsPanelStateManagerFactory> &
    Map<AspectsNames.ItemActions, typeof itemActionsStateManagerFactory> &
    Map<AspectsNames.Stub, typeof stubStateManagerFactory>;
