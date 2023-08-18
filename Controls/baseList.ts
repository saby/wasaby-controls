/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
/**
 * Библиотека, содержащая базовые модули, необходимые для работы всех видов списков.
 * Должна в прямую импортироваться только списковыми контролами, все остальные контролы должны тянуть библиотеку
 * конкретного вида списка (таблица, плитка, дерево и т.п.).
 *
 * @library
 * @private
 */

// region interfaces
export { IList, IReloadItemOptions } from './_baseList/interface/IList';
export * from './_baseList/interface/IEditableList';
export * from 'Controls/_baseList/interface/IMovableList';
export {
    default as IVirtualScroll,
    IVirtualScrollConfig,
    IDirection,
    TVirtualScrollMode,
} from './_baseList/interface/IVirtualScroll';
export { default as IEmptyTemplateOptions } from './_baseList/interface/EmptyTemplate';
export { default as EmptyWrapper } from './_baseList/Render/EmptyWrapper';
export { IRemovableList } from 'Controls/_baseList/interface/IRemovableList';
export { default as IListNavigation } from './_baseList/interface/IListNavigation';
export { IBaseGroupTemplate } from 'Controls/_baseList/interface/BaseGroupTemplate';
export { TCursor } from './_baseList/interface/BaseItemTemplate';
export {
    ISiblingStrategy,
    ISiblingStrategyOptions,
} from 'Controls/_baseList/interface/ISiblingStrategy';
export { IListViewOptions } from 'Controls/_baseList/ListView';
export { IMovableOptions, TBeforeMoveCallback } from 'Controls/_baseList/interface/IMovableList';
export { JS_SELECTOR as JS_NAVIGATION_BUTTON_SELECTOR } from 'Controls/_baseList/BaseControl/NavigationButton';
// endregion

// region templates
import SpaceItemTemplate from 'Controls/_baseList/SpaceItemTemplate';
import MoreButtonTemplate from 'Controls/_baseList/BaseControl/NavigationButton';
import MultiSelectTemplate from 'Controls/_baseList/Render/MultiSelectTemplate';
import MultiSelectCircleTemplate from 'Controls/_baseList/Render/CircleTemplate';
import EditingTemplate from 'Controls/_baseList/EditInPlace/EditingComponent';
import BaseEditingComponent from 'Controls/_baseList/EditInPlace/BaseEditingComponent';
import { default as MoneyEditingTemplate } from 'Controls/_baseList/EditInPlace/decorated/Money';
import { default as NumberEditingTemplate } from 'Controls/_baseList/EditInPlace/decorated/Number';
import ListMarker from 'Controls/_baseList/Marker/ListMarker';
import DraggingCounterTemplate from 'Controls/_baseList/Render/DraggingCounterTemplate';
import {
    ITrackedPropertiesTemplateProps,
    default as TrackedPropertiesComponentWrapper,
    TrackedPropertiesComponent as TrackedPropertiesTemplate,
} from 'Controls/_baseList/TrackedPropertiesTemplate';
import {
    ItemActionsTemplateSelector,
    SwipeActionsTemplate,
    HoverActionsTemplate,
    IHoverActionsTemplateProps,
    ISwipeActionsTemplateProps,
    extractSwipeActionProps,
    IItemActionsHandler,
    IItemActionsTemplateSelectorProps,
} from 'Controls/_baseList/Render/ItemActions';
import For, { IForProps, itemPropsAreEqual } from 'Controls/_baseList/Render/ForReact';

import ItemTemplate from 'Controls/_baseList/ItemComponent';
import GroupTemplate, {
    Content as GroupContentComponent,
    IGroupContentProps,
} from 'Controls/_baseList/GroupTemplate';

export {
    IItemEventHandlers,
    IItemTemplateProps,
    getItemEventHandlers,
    getItemAttrs,
    TItemEventHandler,
} from 'Controls/_baseList/ItemComponent';

export {
    For,
    itemPropsAreEqual,
    IForProps,
    ItemTemplate,
    ItemTemplate as ItemComponent,
    GroupTemplate,
    GroupContentComponent,
    MoreButtonTemplate,
    EditingTemplate,
    // TODO: Удалить по https://online.sbis.ru/opendoc.html?guid=d63d6b23-e271-4d0b-a015-1ad37408b76b
    EditingTemplate as BaseEditingTemplate,
    BaseEditingComponent,
    MultiSelectTemplate,
    MultiSelectCircleTemplate,
    MoneyEditingTemplate,
    NumberEditingTemplate,
    SpaceItemTemplate,
    ListMarker,
    DraggingCounterTemplate,
    TrackedPropertiesTemplate,
    TrackedPropertiesComponentWrapper,
    ITrackedPropertiesTemplateProps,
    ItemActionsTemplateSelector,
    SwipeActionsTemplate,
    HoverActionsTemplate,
    IHoverActionsTemplateProps,
    ISwipeActionsTemplateProps,
    IItemActionsHandler,
    IItemActionsTemplateSelectorProps,
    extractSwipeActionProps,
    IGroupContentProps,
};
// endregion

// region controls
import ListView from 'Controls/_baseList/ListView';
import ScrollEmitter from 'Controls/_baseList/BaseControl/Scroll/Emitter';

export { ListView, ScrollEmitter };

export { default as View, TNotifyCallback } from 'Controls/_baseList/List';
export { default as DataContainer } from 'Controls/_baseList/Data';
export {
    default as ItemsView,
    IItemsViewOptions,
    TItemsViewReceivedState,
} from 'Controls/_baseList/ItemsView';
export { default as ContainerNew } from 'Controls/_baseList/Data/ListContainerConnected';
export {
    IBaseControlOptions,
    IScrollParams,
    default as ListControl,
    default as BaseControl,
    IContentSizesParams,
    IViewPortSizesParams,
    LIST_EDITING_CONSTANTS as editing,
    TLoadingTriggerSelector,
} from 'Controls/_baseList/BaseControl';
export { default as Container } from 'Controls/_baseList/listContainer/WrappedContainer';
// endregion

// region utils
export * from './_baseList/resources/utils/helpers';
export { getItemsBySelection } from './_baseList/resources/utils/getItemsBySelection';
export { default as InertialScrolling } from './_baseList/resources/utils/InertialScrolling';
export { CssClassList, createClassListCollection } from './_baseList/resources/utils/CssClassList';
export { canMoveToDirection, getSiblingItem } from 'Controls/_baseList/resources/utils/moveHelpers';
export { default as BeforeMountAsyncQueueHelper } from './_baseList/BaseControl/BeforeMountAsyncQueueHelper';
// endregion

// region controllers
export * from './_baseList/Controllers/Grouping';
export { FlatSiblingStrategy } from 'Controls/_baseList/Strategies/FlatSiblingStrategy';
// endregion

// region new scroll
export {
    AbstractListVirtualScrollController,
    IAbstractListVirtualScrollControllerOptions,
    IAbstractListVirtualScrollControllerConstructor,
    IAbstractObserversControllerConstructor,
    IAbstractItemsSizesControllerConstructor,
    IScheduledScrollParams,
    IScheduledScrollToElementParams,
    IEdgeItemCalculatingParams,
    IScrollOnReset,
} from './_baseList/Controllers/ScrollController/AbstractListVirtualScrollController';
export {
    ListVirtualScrollController,
    IListVirtualScrollControllerOptions,
    IItemsSizesControllerConstructor,
} from './_baseList/Controllers/ScrollController/ListVirtualScrollController';

export {
    IScrollControllerOptions,
    IDirection as IDirectionNew,
    IPlaceholders,
    IEdgeItem,
    IHasItemsOutsideOfRange,
    IItemsRange,
    ICalcMode,
    IScrollMode,
} from './_baseList/Controllers/ScrollController/ScrollController';
export {
    IItemSize,
    IItemsSizes,
    AbstractItemsSizesController,
    IAbstractItemsSizesControllerOptions,
} from './_baseList/Controllers/ScrollController/ItemsSizeController/AbstractItemsSizeController';
export { ItemsSizeController } from './_baseList/Controllers/ScrollController/ItemsSizeController/ItemsSizeController';
export { default as ItemsSizeControllerMultiColumns } from './_baseList/Controllers/ScrollController/ItemsSizeController/ItemsSizeControllerMultiColumns';
export {
    AbstractObserversController,
    IAbstractObserversControllerOptions,
    TIntersectionEvent,
    ITriggerPosition,
    IAdditionalTriggersOffsets,
} from './_baseList/Controllers/ScrollController/ObserverController/AbstractObserversController';
export {
    IVirtualCollection,
    IVirtualCollectionItem,
} from './_baseList/Controllers/ScrollController/IVirtualCollection';
// endregion

// region Indicators
import TriggerComponent from 'Controls/_baseList/Render/TriggerComponent';
import LoadingIndicatorTemplate from 'Controls/_baseList/indicators/LoadingIndicatorTemplate';
import IterativeLoadingTemplate from 'Controls/_baseList/indicators/IterativeLoadingTemplate';
import ContinueSearchTemplate from 'Controls/_baseList/indicators/ContinueSearchTemplate';
import {
    default as IndicatorTemplate,
    IWrapperIndicatorsTemplateProps as IIndicatorTemplateProps,
} from 'Controls/_baseList/indicators/WrapperIndicatorsTemplate';

export {
    IndicatorTemplate,
    ContinueSearchTemplate,
    IterativeLoadingTemplate,
    LoadingIndicatorTemplate,
    IIndicatorTemplateProps,
    TriggerComponent,
};
// endregion Indicators

export { CollectionItemContext } from 'Controls/_baseList/CollectionItemContext';
export { CollectionContext } from 'Controls/_baseList/CollectionContext';

export {
    groupConstants,
    IHiddenGroupPosition,
    IItemPadding,
    MultiSelectAccessibility,
} from './display';

export { extractWidthsForColumns } from 'Controls/_baseList/resources/utils/resizer';
