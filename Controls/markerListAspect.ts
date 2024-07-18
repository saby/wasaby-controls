export { TVisibility as TMarkerVisibility } from 'Controls/ListAspects/_markerListAspect/common/types';
export { IMarkerState, copyMarkerState } from 'Controls/ListAspects/_markerListAspect/IMarkerState';
export {
    markerStateManagerFactory,
    // TODO: Не использовать, подумать как сделать
    MarkerStateManager as _MarkerStateManager,
    type MarkerStateManager as IMarkerStateManager,
} from 'Controls/ListAspects/_markerListAspect/MarkerStateManager';
export {
    IMoveMarkerChange,
    TMoveMarkerChangeName,
    MoveMarkerChangeName,
    IChangeMarkerVisibilityChange,
    TChangeMarkerVisibilityChangeName,
    ChangeMarkerVisibilityChangeName,
    TMarkerChanges,
} from 'Controls/ListAspects/_markerListAspect/TMarkerChanges';
export { IMarkerStrategy } from 'Controls/ListAspects/_markerListAspect/common/strategy/IMarkerStrategy';
export { SingleColumnMarkerStrategy as CompatibleSingleColumnMarkerStrategy } from 'Controls/ListAspects/_markerListAspect/common/strategy/SingleColumn';
export { MultiColumnMarkerStrategy as CompatibleMultiColumnMarkerStrategy } from 'Controls/ListAspects/_markerListAspect/common/strategy/MultiColumn';
export * as MarkerUILogic from 'Controls/ListAspects/_markerListAspect/UILogic';
