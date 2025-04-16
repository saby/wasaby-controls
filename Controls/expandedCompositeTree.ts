/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { register } from 'Types/di';

export { ItemTemplate } from 'Controls/list';
import Collection from 'Controls/_expandedCompositeTree/display/Collection';
import {
    ICompositeViewConfig,
    TCompositeViewMode,
    ITileConfig,
    TTileSize,
    TTileOrientation,
    TTileMode,
} from 'Controls/_expandedCompositeTree/interface/ICompositeViewConfig';
import CollectionItem from 'Controls/_expandedCompositeTree/display/CollectionItem';
import CompositeCollectionItem from 'Controls/_expandedCompositeTree/display/CompositeCollectionItem';
import CompositeItemStrategy from 'Controls/_expandedCompositeTree/display/strategy/CompositeItem';
import * as CompositeItemTemplate from 'wml!Controls/_expandedCompositeTree/render/CompositeItemTemplate';
import { default as NodeItemTemplate } from 'Controls/_expandedCompositeTree/render/NodeItemTemplate';

export { default as CompositeItemWrapper } from 'Controls/_expandedCompositeTree/CompositeItemWrapper';

export {
    IExpandedCompositeTree,
    IListEventHandlers,
} from 'Controls/_expandedCompositeTree/interface/IExpandedCompositeTree';
export { View } from 'Controls/_expandedCompositeTree/ExpandedCompositeTree';
import ImageDisplayContainer from 'Controls/_expandedCompositeTree/ImageDisplayContainer';

export {
    Collection,
    CollectionItem,
    CompositeCollectionItem,
    CompositeItemTemplate,
    NodeItemTemplate,
    ImageDisplayContainer,
    CompositeItemStrategy,
    ICompositeViewConfig,
    TCompositeViewMode,
    ITileConfig,
    TTileSize,
    TTileOrientation,
    TTileMode,
};

/**
 * Библиотека контролов, для отображения иерархии в развернутом виде и установке режима отображения элементов на каждом уровне вложенности.
 * @library
 * @includes IExpandedCompositeTreeControl Controls/_expandedCompositeTree/interface/IExpandedCompositeTree
 * @public
 */

register('Controls/expandedCompositeTree:Collection', Collection, {
    instantiate: false,
});
register('Controls/expandedCompositeTree:CollectionItem', CollectionItem, {
    instantiate: false,
});
register('Controls/expandedCompositeTree:CompositeCollectionItem', CompositeCollectionItem, {
    instantiate: false,
});
