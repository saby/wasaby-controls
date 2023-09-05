/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
/**
 * Библиотека, которая предоставляет различные виды коллекций.
 * @library
 * @public
 */

/*
 * Library that provides various views over collections
 * @library
 * @public
 * @author Авраменко А.С.
 */
import { register } from 'Types/di';
export { default as Abstract } from './_display/Abstract';
import {
    default as Collection,
    IOptions as ICollectionOptions,
    IEditingConfig,
    IItemActionsTemplateConfig,
    ISwipeConfig,
    ItemsFactory,
    IViewIterator,
    ISessionItems,
    ISerializableState as ICollectionSerializableState,
    ISessionItemState,
    ISplicedArray,
    StrategyConstructor,
} from './_display/Collection';
export {
    Collection,
    ICollectionOptions,
    IEditingConfig,
    ISessionItems,
    IItemActionsTemplateConfig,
    ISwipeConfig,
    ItemsFactory,
    IViewIterator,
    ICollectionSerializableState,
    ISessionItemState,
    ISplicedArray,
    StrategyConstructor,
};
export { InstantiableMixin } from './_display/InstantiableMixin';
export { ISourceCollection } from './_display/interface/ICollection';
export {
    default as CollectionItem,
    IOptions as ICollectionItemOptions,
    TItemBaseLine,
} from './_display/CollectionItem';
import { default as GroupItem } from './_display/GroupItem';
export { GroupItem };
import * as itemsStrategy from './_display/itemsStrategy';
export { itemsStrategy };
export { default as InitStateByOptionsMixin } from 'Controls/_display/InitStateByOptionsMixin';
export {
    IDataStrategy as ISourceDataStrategy,
    default as FlatDataStrategy,
} from 'Controls/_display/dataStrategy/FlatDataStrategy';

import ExpandableMixin, {
    IOptions as IExpandableMixinOptions,
} from 'Controls/_display/ExpandableMixin';
export { ExpandableMixin, IExpandableMixinOptions };

export { default as IMarkable } from './_display/interface/IMarkable';
export { default as ISelectableItem } from './_display/interface/ISelectableItem';
export { default as IEnumerableItem } from './_display/interface/IEnumerableItem';

export { default as IGroupNode } from './_display/interface/IGroupNode';

import { default as CollectionItem } from 'Controls/_display/CollectionItem';

export type {
    TAnimationState,
    IItemPadding,
    TVerticalItemPadding,
} from './_display/interface/ICollection';
export { IEditableCollection } from './_display/interface/IEditableCollection';
export { IEditableCollectionItem } from './_display/interface/IEditableCollectionItem';
export {
    ICollectionItem,
    TMarkerSize,
    TRowSeparatorVisibility,
    TItemsSpacingVisibility,
    TRowSeparatorSize,
    TColumnSeparatorSize,
    TBorderVisibility,
    TShadowVisibility,
    TBorderStyle,
} from './_display/interface/ICollectionItem';
export { IBaseCollection, TItemKey } from './_display/interface';

import * as GridLadderUtil from './_display/utils/GridLadderUtil';
export { GridLadderUtil };
export {
    ILadderObject,
    IStickyColumn,
    ILadderConfig,
    IStickyLadderConfig,
    TLadderElement,
} from './_display/utils/GridLadderUtil';
export { default as isFullGridSupport } from './_display/utils/GridSupportUtil';
export { default as GridLayoutUtil } from './_display/utils/GridLayoutUtil';

import * as VirtualScrollController from './_display/controllers/VirtualScroll';

export { VirtualScrollController };
import * as VirtualScrollHideController from './_display/controllers/VirtualScrollHide';

export { VirtualScrollHideController };
import { IDragPosition } from './_display/interface/IDragPosition';
export { IDragPosition };
export { groupConstants } from './_display/itemsStrategy/Group';
export { IHiddenGroupPosition } from './_display/itemsStrategy/Group';
export { MultiSelectAccessibility } from './_display/Collection';
export { IHasMoreData } from './_display/Collection';
export { MoreButtonVisibility } from './_display/Collection';
export { TItemActionsPosition } from './_display/Collection';

export { default as CollectionEnumerator } from 'Controls/_display/CollectionEnumerator';
export { getFlatNearbyItem } from 'Controls/_display/utils/NearbyItemUtils';

export {
    getEditorViewRenderClassName,
    getEditorClassName,
    IGetEditorViewClassNameParams,
} from 'Controls/_display/utils/ClassNameUtils';

import IItemsStrategy, {
    IOptions as IItemsStrategyOptions,
} from 'Controls/_display/IItemsStrategy';
export { IItemsStrategy, IItemsStrategyOptions };

import { Footer, IOptions as IFooterOptions } from './_display/Footer';
export { Footer, IFooterOptions };

import Indicator from 'Controls/_display/Indicator';
export {
    default as Indicator,
    EIndicatorState,
    TIndicatorState,
    TIndicatorPosition,
    TIndicatorSelector,
    IndicatorSelector,
} from 'Controls/_display/Indicator';
export { default as IndicatorsMixin } from 'Controls/_display/IndicatorsMixin';
import Trigger, { IOptions as ITriggerOptions } from 'Controls/_display/Trigger';
export { Trigger, ITriggerOptions };

export { default as GroupMixin } from 'Controls/_display/GroupMixin';
import { SpaceCollectionItem } from 'Controls/_display/SpaceCollectionItem';
export { getValidItemKeyAttribute } from 'Controls/_display/ItemCompatibilityListViewModel';
export { SpaceCollectionItem };

export {
    IFlatDataStrategyOptions,
    TCollection,
    TSourceItem,
} from 'Controls/_display/dataStrategy/FlatDataStrategy';

export { getBorderClassName } from 'Controls/_display/utils/ClassNameUtils';

register('Controls/display:Collection', Collection, { instantiate: false });
register('Controls/display:CollectionItem', CollectionItem, {
    instantiate: false,
});

register('Controls/display:GroupItem', GroupItem, { instantiate: false });
register('Controls/display:Footer', Footer, { instantiate: false });

register('Controls/display:Indicator', Indicator, { instantiate: false });
register('Controls/display:Trigger', Trigger, { instantiate: false });
register('Controls/display:SpaceCollectionItem', SpaceCollectionItem, {
    instantiate: false,
});
