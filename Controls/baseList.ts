/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Библиотека, содержащая базовые модули, необходимые для работы всех видов списков.
 * Должна в прямую импортироваться только списковыми контролами, все остальные контролы должны тянуть библиотеку
 * конкретного вида списка (таблица, плитка, дерево и т.п.).
 *
 * @library
 * @embedded
 */

// region interfaces
export { IList, TListStyle, IReloadItemOptions } from './_baseList/interface/IList';
export * from 'Controls/_baseList/interface/IMovableList';
export {
    default as IEmptyTemplate,
    TEmptyTemplateAlign,
    TEmptyTemplateSpacing,
} from './_baseList/interface/EmptyTemplate';
export { default as EmptyWrapper } from './_baseList/Render/EmptyWrapper';
export { IRemovableList } from 'Controls/_baseList/interface/IRemovableList';
export { default as IListNavigation } from './_baseList/interface/IListNavigation';
export { INavigationButtonProps } from 'Controls/_baseList/interface/INavigationButton';
export {
    IBaseGroupTemplate,
    TGroupExpanderAlign,
} from 'Controls/_baseList/interface/BaseGroupTemplate';
export { TCursor } from './_baseList/interface/BaseItemTemplate';
export {
    ISiblingStrategy,
    ISiblingStrategyOptions,
} from 'Controls/_baseList/interface/ISiblingStrategy';
export { IListViewOptions } from 'Controls/_baseList/ListView';
export { IMovableOptions, TBeforeMoveCallback } from 'Controls/_baseList/interface/IMovableList';
export { JS_SELECTOR as JS_NAVIGATION_BUTTON_SELECTOR } from 'Controls/_baseList/BaseControl/NavigationButton';
export { TItemDeactivatedHandler } from 'Controls/_baseList/ItemComponent';

// endregion

// region templates
import SpaceItemTemplate from 'Controls/_baseList/SpaceItemTemplate';
import {
    default as MoreButtonTemplate,
    ConnectedCustomNavigationButton,
} from 'Controls/_baseList/BaseControl/NavigationButton';
import MultiSelectTemplate from 'Controls/_baseList/Render/MultiSelectTemplate';
import MultiSelectCircleTemplate, {
    CheckboxCircleMarker,
    ICheckboxCircleMarkerProps,
} from 'Controls/_baseList/Render/MultiSelectCircleTemplate';
import EditingTemplate from 'Controls/_baseList/EditInPlace/compatibleLayer/EditingTemplate';
import { default as MoneyEditingTemplate } from 'Controls/_baseList/EditInPlace/decorated/Money';
import { default as NumberEditingTemplate } from 'Controls/_baseList/EditInPlace/decorated/Number';
import { default as ListMarker, TMarkerPosition } from 'Controls/_baseList/Marker/ListMarker';
import {
    default as TrackedPropertiesComponentWrapper,
    ITrackedPropertiesContext,
    ITrackedPropertiesTemplateProps,
    TrackedPropertiesComponent as TrackedPropertiesTemplate,
    TrackedPropertiesContext,
} from 'Controls/_baseList/TrackedPropertiesTemplate';
import { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';

import { default as ActionsConnectedComponent } from 'Controls/_baseList/ActionsConnectedComponent';

import For, { IForProps, itemPropsAreEqual } from 'Controls/_baseList/Render/ForReact';

import ItemTemplate from 'Controls/_baseList/ItemComponent';
import GroupTemplate, {
    Content as GroupContentComponent,
    IGroupContentProps,
} from 'Controls/_baseList/GroupTemplate';
// region controls
import ListView from 'Controls/_baseList/ListView';
import ScrollEmitter from 'Controls/_baseList/BaseControl/Scroll/Emitter';
// region new scroll
import { ScrollControllerLib, hooks } from 'Controls/listsCommonLogic';
// region Indicators

export {
    IItemEventHandlers,
    IItemTemplateProps,
    getItemEventHandlers,
    TItemEventHandler,
} from 'Controls/_baseList/ItemComponent';

export {
    IEditingConfig,
    TBeforeEndEditEventResult,
    TAsyncOperationResult,
    TAddPosition,
    IEditableList,
    IEditableListOptions,
    IItemEditOptions,
    IItemAddOptions,
    IOperationCanceledResult,
    TBeforeBeginEditEventResult,
} from 'Controls/_baseList/interface/IEditableList';

export {
    TInputBorderVisibility,
    TInputBackgroundVisibility,
    default as IEditingTemplateOptions,
} from 'Controls/_baseList/interface/EditingTemplate';

export {
    For,
    itemPropsAreEqual,
    IForProps,
    ItemTemplate,
    ItemTemplate as ItemComponent,
    GroupTemplate,
    GroupContentComponent,
    ConnectedCustomNavigationButton,
    MoreButtonTemplate,
    EditingTemplate,
    // TODO: Удалить по https://online.sbis.ru/opendoc.html?guid=d63d6b23-e271-4d0b-a015-1ad37408b76b
    EditingTemplate as BaseEditingTemplate,
    MultiSelectTemplate,
    MultiSelectCircleTemplate,
    CheckboxCircleMarker,
    ICheckboxCircleMarkerProps,
    MoneyEditingTemplate,
    NumberEditingTemplate,
    SpaceItemTemplate,
    ListMarker,
    TMarkerPosition,
    TrackedPropertiesTemplate,
    TrackedPropertiesComponentWrapper,
    ITrackedPropertiesTemplateProps,
    ITrackedPropertiesContext,
    TrackedPropertiesContext,
    IItemActionsHandler,
    IGroupContentProps,
    ActionsConnectedComponent,
};
// endregion

export { ListView, ScrollEmitter };

export { default as View, TNotifyCallback } from 'Controls/_baseList/List';
// Используется в explorer'e и Kanban'e, чтобы обернуть View в DataContainer
export { default as DataContainerConnected } from 'Controls/_baseList/Data';
// Используется в Browser'e и внутри самого списка. Это контейнер, который обновляет слайс при изменении опций контрола и при получении событий от View
export { default as ListContainerConnectedCompatible } from 'Controls/_baseList/Data/compatible/ListContainerConnectedCompatible';
export {
    default as DataController,
    getDataFactoryArguments,
} from 'Controls/_baseList/Data/compatible/Controller';
export { DATA_SYNTHETIC_STORE_ID } from 'Controls/_baseList/Data/compatible/constants';
export { default as VIEW_PROPS } from 'Controls/_baseList/Data/connector/contstants/ViewProps';
// Будет удалено в 24.1000
export { IDataOptions } from 'Controls/_baseList/interface/IDataOptions';
export {
    default as ItemsView,
    IItemsViewOptions,
    TItemsViewReceivedState,
} from 'Controls/_baseList/ItemsView';
export { default as ContainerNew } from 'Controls/_baseList/Data/ListContainerConnected';
export { IConnectorProps as IContainerNewProps } from 'Controls/_baseList/Data/connector/interface/IConectorProps';
export * from 'Controls/_baseList/Data/INewListScheme';
export {
    IBaseControlOptions,
    IScrollParams,
    default as ListControl,
    default as BaseControl,
    IListHandlers,
    IContentSizesParams,
    IViewPortSizesParams,
    LIST_EDITING_CONSTANTS as editing,
    TLoadingTriggerSelector,
    TBottomPaddingMode,
    TExtLogInfo,
    NOT_EDITABLE_JS_SELECTOR,
} from 'Controls/_baseList/BaseControl';
// endregion

// region utils
export * from './_baseList/resources/utils/helpers';
export { default as InertialScrolling } from './_baseList/resources/utils/InertialScrolling';
export { default as BeforeMountAsyncQueueHelper } from './_baseList/BaseControl/BeforeMountAsyncQueueHelper';
export {
    getBottomPaddingClass as getBottomPaddingClassUtil,
    TBottomPaddingClass,
} from './_baseList/resources/utils/bottomPadding';
// endregion

// region controllers
export * from './_baseList/Controllers/Grouping';
export { HoveredItem } from 'Controls/_baseList/Controllers/HoveredItem';
export { FlatSiblingStrategy } from 'Controls/_baseList/Strategies/FlatSiblingStrategy';
// endregion

const AbstractListVirtualScrollController = ScrollControllerLib.AbstractListVirtualScrollController;
type IAbstractListVirtualScrollControllerOptions =
    ScrollControllerLib.IAbstractListVirtualScrollControllerOptions;
type IAbstractListVirtualScrollControllerConstructor =
    ScrollControllerLib.IAbstractListVirtualScrollControllerConstructor;
type IAbstractObserversControllerConstructor =
    ScrollControllerLib.IAbstractObserversControllerConstructor;
type IAbstractItemsSizesControllerConstructor =
    ScrollControllerLib.IAbstractItemsSizesControllerConstructor;
type IScheduledScrollParams = ScrollControllerLib.IScheduledScrollParams;
type IScheduledScrollToElementParams = ScrollControllerLib.IScheduledScrollToElementParams;
type IEdgeItemCalculatingParams = ScrollControllerLib.IEdgeItemCalculatingParams;
type IScrollOnReset = ScrollControllerLib.IScrollOnReset;

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
};

const ListVirtualScrollController = ScrollControllerLib.ListVirtualScrollController;
type IListVirtualScrollControllerOptions = ScrollControllerLib.IListVirtualScrollControllerOptions;
type IItemsSizesControllerConstructor = ScrollControllerLib.IItemsSizesControllerConstructor;
export {
    ListVirtualScrollController,
    IListVirtualScrollControllerOptions,
    IItemsSizesControllerConstructor,
};

type IScrollControllerOptions = ScrollControllerLib.IScrollControllerOptions;
type IDirectionNew = ScrollControllerLib.IDirectionNew;
type IPlaceholders = ScrollControllerLib.IPlaceholders;
type IEdgeItem = ScrollControllerLib.IEdgeItem;
type IHasItemsOutsideOfRange = ScrollControllerLib.IHasItemsOutsideOfRange;
type IItemsRange = ScrollControllerLib.IItemsRange;
type ICalcMode = ScrollControllerLib.ICalcMode;
type IScrollMode = ScrollControllerLib.IScrollMode;

export {
    IScrollControllerOptions,
    IDirectionNew,
    IPlaceholders,
    IEdgeItem,
    IHasItemsOutsideOfRange,
    IItemsRange,
    ICalcMode,
    IScrollMode,
};

const AbstractItemsSizesController = ScrollControllerLib.AbstractItemsSizesController;
type IItemSize = ScrollControllerLib.IItemSize;
type IItemsSizes = ScrollControllerLib.IItemsSizes;
type IAbstractItemsSizesControllerOptions =
    ScrollControllerLib.IAbstractItemsSizesControllerOptions;
export {
    AbstractItemsSizesController,
    IItemSize,
    IItemsSizes,
    IAbstractItemsSizesControllerOptions,
};

const ItemsSizeController = ScrollControllerLib.ItemsSizeController;
export { ItemsSizeController };

const ItemsSizeControllerMultiColumns = ScrollControllerLib.ItemsSizeControllerMultiColumns;
export { ItemsSizeControllerMultiColumns };

const AbstractObserversController = ScrollControllerLib.AbstractObserversController;
const DEFAULT_TRIGGER_OFFSET = ScrollControllerLib.DEFAULT_TRIGGER_OFFSET;
type IAbstractObserversControllerOptions = ScrollControllerLib.IAbstractObserversControllerOptions;
type TIntersectionEvent = ScrollControllerLib.TIntersectionEvent;
type ITriggerPosition = ScrollControllerLib.ITriggerPosition;
type IAdditionalTriggersOffsets = ScrollControllerLib.IAdditionalTriggersOffsets;
export {
    AbstractObserversController,
    DEFAULT_TRIGGER_OFFSET,
    IAbstractObserversControllerOptions,
    TIntersectionEvent,
    ITriggerPosition,
    IAdditionalTriggersOffsets,
};

const ObserversController = ScrollControllerLib.ObserversController;
type IObserversControllerOptions = ScrollControllerLib.IObserversControllerOptions;
export { ObserversController, IObserversControllerOptions };

type IVirtualCollection = ScrollControllerLib.IVirtualCollection;
type IVirtualCollectionItem = ScrollControllerLib.IVirtualCollectionItem;
export { IVirtualCollection, IVirtualCollectionItem };

type IVirtualScroll = ScrollControllerLib.IVirtualScroll;
type IVirtualScrollConfig = ScrollControllerLib.IVirtualScrollConfig;
type IDirection = ScrollControllerLib.IDirection;
type TVirtualScrollMode = ScrollControllerLib.TVirtualScrollMode;
export { IVirtualScroll, IVirtualScrollConfig, IDirection, TVirtualScrollMode };

const getCalcMode = ScrollControllerLib.getCalcMode;
const getScrollMode = ScrollControllerLib.getScrollMode;
export { getCalcMode, getScrollMode };

const AbstractCalculator = ScrollControllerLib.AbstractCalculator;
type IAbstractCalculatorResult = ScrollControllerLib.IAbstractCalculatorResult;
const Calculator = ScrollControllerLib.Calculator;
const CalculatorWithoutVirtualization = ScrollControllerLib.CalculatorWithoutVirtualization;
export {
    AbstractCalculator,
    Calculator,
    CalculatorWithoutVirtualization,
    IAbstractCalculatorResult,
};
// endregion

// endregion Indicators
export {
    CollectionItemContext,
    CollectionProvider,
    useCollection,
    // Не использовать, оставил чтобы не сломать прикладников, которые могли заточиться.
    // Есть хук useCollection - его нужно использовать.
    _CollectionContext as CollectionContext,
    // Не использовать, оставил чтобы не сломать прикладников, которые могли заточиться.
    // Есть хук useCollection - его нужно использовать.
    _ListContext as ListContext,
    useListContext,
    ListContextProvider,
    LoadingIndicatorTemplate,
    IterativeLoadingTemplate,
    ContinueSearchTemplate,
    IContinueSearchTemplateProps,
    IndicatorTemplate,
    IIndicatorTemplateProps,
    TriggerComponent,
    CollectionTriggerComponent,
    ItemActionsTemplateSelector,
    IItemActionsTemplateSelectorProps,
    HoverActionsTemplate,
    IHoverActionsTemplateProps,
    SwipeActionsTemplate,
    ISwipeActionsTemplateProps,
} from 'Controls/listsCommonLogic';
const { useItemActionsDeferredInitialization, useItemState, useItemData } = hooks;
export { useItemActionsDeferredInitialization, useItemState, useItemData };
export {
    DraggingCounterTemplate,
    BaseEditingComponent,
    extractSwipeActionProps,
    getItemActionsTemplate,
} from 'Controls/listVisualAspects';

export {
    groupConstants,
    IHiddenGroupPosition,
    IItemPadding,
    MultiSelectAccessibility,
} from './display';

export {
    BaseControlComponent,
    TOldBaseControlCompatibility,
    TBaseControlComponentProps,
} from './_baseList/compatibility/BaseControlComponent';
export { TAlaListConnectedHandlers } from './_baseList/compatibility/types/TAlaListConnectedHandlers';
export { TCompatibilityForUndoneAspects } from './_baseList/compatibility/types/TCompatibilityForUndoneAspects';
export * as NotificationCompatibility from './_baseList/compatibility/NotificationCompatibility';
export { extractWidthsForColumns } from 'Controls/_baseList/resources/utils/resizer';
