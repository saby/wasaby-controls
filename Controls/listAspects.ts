// Controls/markerListAspect

export { TVisibility as TMarkerVisibility } from 'Controls/_listAspects/_markerListAspect/common/types';
export {
    IMarkerState,
    copyMarkerState,
} from 'Controls/_listAspects/_markerListAspect/IMarkerState';
export {
    markerStateManagerFactory,
    // TODO: Не использовать, подумать как сделать
    MarkerStateManager as _MarkerStateManager,
    type MarkerStateManager as IMarkerStateManager,
} from 'Controls/_listAspects/_markerListAspect/MarkerStateManager';
export {
    IMoveMarkerChange,
    TMoveMarkerChangeName,
    MoveMarkerChangeName,
    IChangeMarkerVisibilityChange,
    TChangeMarkerVisibilityChangeName,
    ChangeMarkerVisibilityChangeName,
    TMarkerChanges,
} from 'Controls/_listAspects/_markerListAspect/TMarkerChanges';
export { IMarkerStrategy } from 'Controls/_listAspects/_markerListAspect/common/strategy/IMarkerStrategy';
export { SingleColumnMarkerStrategy as CompatibleSingleColumnMarkerStrategy } from 'Controls/_listAspects/_markerListAspect/common/strategy/SingleColumn';
export { MultiColumnMarkerStrategy as CompatibleMultiColumnMarkerStrategy } from 'Controls/_listAspects/_markerListAspect/common/strategy/MultiColumn';
export * as MarkerUILogic from 'Controls/_listAspects/_markerListAspect/UILogic';

// Controls/itemsListAspect
export { IItemsState, copyItemsState } from 'Controls/_listAspects/_itemsListAspect/IItemsState';
export {
    IReplaceItemsChange,
    TReplaceItemsChangeName,
    ReplaceItemsChangeName,
    IReplaceAllItemsChange,
    TReplaceAllItemsChangeName,
    ReplaceAllItemsChangeName,
    IRemoveItemsChange,
    TRemoveItemsChangeName,
    RemoveItemsChangeName,
    IAppendItemsChange,
    TAppendItemsChangeName,
    AppendItemsChangeName,
    IPrependItemsChange,
    TPrependItemsChangeName,
    PrependItemsChangeName,
    TItemsChanges,
    ListChangeSourceEnum,
    TListChangeSource,
    FirstItemKeySymbol,
} from 'Controls/_listAspects/_itemsListAspect/TItemsChanges';
export {
    itemsStateManagerFactory,
    type ItemsStateManager as IItemsStateManager,
} from 'Controls/_listAspects/_itemsListAspect/ItemsStateManager';
export {
    type TItemsChange,
    type TMetaDataChange,
} from 'Controls/_listAspects/_itemsListAspect/IItemsState';
export { convertCollectionChangesToListChanges } from 'Controls/_listAspects/_itemsListAspect/helpers/convertCollectionChangesToListChanges';
export { getMarkerStrategy } from 'Controls/_listAspects/_markerListAspect/UILogic/getMarkerStrategy';

// Controls/rootListAspect
export { IRootState, copyRootState } from 'Controls/_listAspects/_rootListAspect/IRootState';
export {
    rootStateManagerFactory,
    type RootStateManager as IRootStateManager,
} from 'Controls/_listAspects/_rootListAspect/RootStateManager';
export * as RootUILogic from 'Controls/_listAspects/_rootListAspect/UILogic';

// Controls/flatSelectionAspect
export {
    IFlatSelectionState,
    copyFlatSelectionState,
} from 'Controls/_listAspects/selection/_flatSelectionAspect/IFlatSelectionState';
export { flatSelectionStateManagerFactory } from 'Controls/_listAspects/selection/_flatSelectionAspect/FlatSelectionStateManager';
export { FlatSelectionStateManager as IFlatSelectionStateManager } from 'Controls/_listAspects/selection/_flatSelectionAspect/FlatSelectionStateManager';
export { FlatSelectionStrategy } from 'Controls/_listAspects/selection/_flatSelectionAspect/FlatSelectionStrategy';
export * as FlatUtils from 'Controls/_listAspects/selection/_flatSelectionAspect/Utils';

// Controls/hierarchySelectionAspect
export {
    IEntryPathItem,
    IHierarchySelectionState,
    copyHierarchySelectionState,
} from 'Controls/_listAspects/selection/_hierarchySelectionAspect/IHierarchySelectionState';
export { hierarchySelectionStateManagerFactory } from 'Controls/_listAspects/selection/_hierarchySelectionAspect/HierarchySelectionStateManager';
export type { HierarchySelectionStateManager as IHierarchySelectionStateManager } from 'Controls/_listAspects/selection/_hierarchySelectionAspect/HierarchySelectionStateManager';
export { HierarchySelectionStrategy } from 'Controls/_listAspects/selection/_hierarchySelectionAspect/HierarchySelectionStrategy';
export * as HierarchyUtils from 'Controls/_listAspects/selection/_hierarchySelectionAspect/Utils';

// Controls/pathListAspect
export { IPathState, copyPathState } from 'Controls/_listAspects/_pathListAspect/IPathState';
export {
    pathStateManagerFactory,
    type PathStateManager as IPathStateManager,
} from 'Controls/_listAspects/_pathListAspect/PathStateManager';

// Controls/expandCollapseListAspect
export {
    expandCollapseStateManagerFactory,
    ExpandCollapseStateManager as CompatibleExpandCollapseStateManager,
    ExpandCollapseStateManager as _ExpandCollapseStateManager,
    type ExpandCollapseStateManager as IExpandCollapseStateManager,
} from 'Controls/_listAspects/_expandCollapseListAspect/ExpandCollapseStateManager';
export {
    CollapseChangeName,
    ExpandChangeName,
    TExpandCollapseChanges,
} from 'Controls/_listAspects/_expandCollapseListAspect/TExpandCollapseChanges';
export {
    IExpandCollapseState,
    copyExpandCollapseState,
} from 'Controls/_listAspects/_expandCollapseListAspect/IExpandCollapseState';
export { TExpansionModel } from 'Controls/_listAspects/_expandCollapseListAspect/common/TExpansionModel';
export { ALL_EXPANDED_VALUE as COMPATIBLE_ALL_EXPANDED_VALUE } from 'Controls/_listAspects/_expandCollapseListAspect/UILogic/isExpandAll';
export * as ExpandCollapseUILogic from 'Controls/_listAspects/_expandCollapseListAspect/UILogic';

// Controls/operationsPanelListAspect
export { TVisibility } from './_listAspects/_operationsPanelListAspect/common/types';
export {
    IOperationsPanelState,
    copyOperationsPanelState,
} from './_listAspects/_operationsPanelListAspect/IOperationsPanelState';
export {
    OperationsPanelVisibilityChangeName,
    TOperationsPanelVisibilityChangeName,
    IOperationsPanelVisibilityChange,
    TOperationsPanelChanges,
} from './_listAspects/_operationsPanelListAspect/TOperationsPanelChanges';
export {
    operationsPanelStateManagerFactory,
    type OperationsPanelStateManager as IOperationsPanelStateManager,
} from './_listAspects/_operationsPanelListAspect/OperationsPanelStateManager';

// Controls/stubListAspect
export { IStubState, copyStubState } from './_listAspects/_stubListAspect/IStubState';
export {
    AddStubChangeName,
    TAddStubChangeName,
    IAddStubChange,
    RemoveStubChangeName,
    TRemoveStubChangeName,
    IRemoveStubChange,
    TStubChanges,
} from './_listAspects/_stubListAspect/TSStubChanges';
export {
    type StubStateManager as IStubStateManager,
    stubStateManagerFactory,
} from './_listAspects/_stubListAspect/StubStateManager';

// Controls/highlightFieldsListAspect
export {
    THighlightedFieldsMap,
    THighlightedValues,
} from 'Controls/_listAspects/_highlightFieldsListAspect/common/types';
export {
    type HighlightFieldsStateManager as IHighlightFieldsStateManager,
    highlightFieldsStateManagerFactory,
} from 'Controls/_listAspects/_highlightFieldsListAspect/HighlightFieldsStateManager';
export { IHighlightFieldsState } from 'Controls/_listAspects/_highlightFieldsListAspect/IHighlightFieldsState';
export {
    HighlightedFieldsChangeName,
    THighlightedFieldsChangeName,
    IHighlightedFieldsChange,
    THighlightFieldsChanges,
} from 'Controls/_listAspects/_highlightFieldsListAspect/THighlightFieldsChanges';

// Controls/abstractListAspect
export {
    AbstractAspectStateManager,
    TAbstractAspectStateManagerProps,
} from 'Controls/_listAspects/_abstractListAspect/abstract/AbstractAspectStateManager';
export {
    IListChange,
    ListChangeNameEnum,
    IGetListChangeByName,
    IMoveMarkerListChange,
} from 'Controls/_listAspects/_abstractListAspect/common/ListChanges';

export {
    IStateWithItems,
    copyStateWithItems,
    fixStateWithItems,
} from 'Controls/_listAspects/_abstractListAspect/common/IStateWithItems';
export {
    copyStateWithHierarchyItems,
    fixStateWithHierarchyItems,
    IStateWithHierarchyItems,
} from 'Controls/_listAspects/_abstractListAspect/common/IStateWithHierarchyItems';

export * as CommonUILogic from 'Controls/_listAspects/_abstractListAspect/common/UILogic';

// Controls/abstractSelectionAspect
export {
    IAbstractSelectionState,
    copyAbstractSelectionState,
    TSelectionModel,
    TSelectionModelStatus,
} from 'Controls/_listAspects/selection/_abstractSelectionAspect/IAbstractSelectionState';
export {
    ISelectionChange,
    SelectionObjectChangeName,
    TSelectionObjectChangeName,
    SelectionMapChangeName,
    TSelectionMapChangeName,
    TSelectionChanges,
} from 'Controls/_listAspects/selection/_abstractSelectionAspect/TSelectionChanges';
export { ISelectionStrategy } from 'Controls/_listAspects/selection/_abstractSelectionAspect/ISelectionStrategy';
export {
    AbstractSelectionStateManager,
    TAbstractSelectionStateManagerProps,
} from 'Controls/_listAspects/selection/_abstractSelectionAspect/AbstractSelectionStateManager';
export * as BaseUtils from 'Controls/_listAspects/selection/_abstractSelectionAspect/Utils';

// Controls/itemActionsListAspect
export { IItemActionsState } from 'Controls/_listAspects/_itemActionsListAspect/ItemActionsState';
export {
    type ItemActionsStateManager as IItemActionsStateManager,
    ItemActionsStateManager as _ItemActionsStateManager,
    itemActionsStateManagerFactory,
} from 'Controls/_listAspects/_itemActionsListAspect/ItemActionsStateManager';
export {
    TItemActionsMap,
    IAction,
    TItemActionVisibilityCallback,
} from 'Controls/_listAspects/_itemActionsListAspect/common/types';
export {
    TItemActionsChangeName,
    TItemActionsChanges,
} from 'Controls/_listAspects/_itemActionsListAspect/TItemActionsChanges';
