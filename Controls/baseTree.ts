import {
    BaseTreeControl,
    IBaseTreeControlOptions,
} from 'Controls/_baseTree/BaseTreeControl';
import ITree, {
    IOptions as ITreeOptions,
} from 'Controls/_baseTree/interface/ITree';
export {
    TExpanderPosition,
    TExpanderVisibility,
} from 'Controls/_baseTree/interface/ITree';
import {
    applyReloadedNodes,
    getReloadItemsHierarchy,
    getRootsForHierarchyReload,
    getItemHierarchy,
} from 'Controls/_baseTree/utils';

import AdjacencyList from 'Controls/_baseTree/display/strategies/AdjacencyList';
import NodeFooterStrategy from 'Controls/_baseTree/display/strategies/NodeFooter';
import NodeHeaderStrategy from 'Controls/_baseTree/display/strategies/NodeHeader';
import ExtraNodeItemStrategy from 'Controls/_baseTree/display/strategies/ExtraNodeItem';
import RootStrategy from 'Controls/_baseTree/display/strategies/Root';
import RootSeparatorStrategy from 'Controls/_baseTree/display/strategies/RootSeparator';
import TreeDragStrategy from 'Controls/_baseTree/display/strategies/TreeDrag';
import SearchStrategy from 'Controls/_baseTree/display/strategies/Search';
import MaterializedPathStrategy, {
    IOptions as IMaterializedPathStrategyOptions,
} from 'Controls/_baseTree/display/strategies/MaterializedPath';
import {
    ITreeStrategyOptions,
    TreeSiblingStrategy,
} from 'Controls/_baseTree/display/strategies/TreeSiblingStrategy';
import TreeChildren from 'Controls/_baseTree/display/TreeChildren';
import BreadcrumbsItem from 'Controls/_baseTree/display/BreadcrumbsItem';
import Tree, {
    NODE_TYPE_PROPERTY_GROUP,
    IOptions as ITreeCollectionOptions,
} from 'Controls/_baseTree/display/Tree';
import TreeItem, {
    IOptions as ITreeItemOptions,
} from 'Controls/_baseTree/display/TreeItem';
import NodeFooter from 'Controls/_baseTree/display/NodeFooter';
import RootSeparatorItem from 'Controls/_baseTree/display/RootSeparatorItem';
import TreeItemDecorator from 'Controls/_baseTree/display/TreeItemDecorator';
import { SpaceCollectionItem } from 'Controls/_baseTree/display/SpaceCollectionItem';
import Search from 'Controls/_baseTree/display/Search';

export {
    TExpanderIconStyle,
    TExpanderIconSize,
    TChildrenLoadMode,
    TExpanderPaddingVisibility,
} from 'Controls/_baseTree/display/interface/ITree';

export {
    BaseTreeControl,
    IBaseTreeControlOptions,
    TreeSiblingStrategy,
    ITreeStrategyOptions,
    ITree,
    ITreeOptions,
    NODE_TYPE_PROPERTY_GROUP,
    Tree,
    ITreeCollectionOptions,
    TreeItem,
    ITreeItemOptions,
    NodeFooter,
    TreeChildren,
    BreadcrumbsItem,
    TreeItemDecorator,
    RootSeparatorItem,
    SpaceCollectionItem,
    Search,
    AdjacencyList,
    NodeFooterStrategy,
    NodeHeaderStrategy,
    ExtraNodeItemStrategy,
    SearchStrategy,
    RootStrategy,
    RootSeparatorStrategy,
    TreeDragStrategy,
    MaterializedPathStrategy,
    IMaterializedPathStrategyOptions,
    applyReloadedNodes,
    getReloadItemsHierarchy,
    getRootsForHierarchyReload,
    getItemHierarchy,
};

export {
    ExpanderComponent,
    LevelPaddingsComponent,
    ExpanderBlockComponent,
    IExpanderProps,
    getExpanderProps,
} from 'Controls/_baseTree/render/ExpanderComponent';

import { register } from 'Types/di';
register('Controls/display:Tree', Tree, { instantiate: false });
register('Controls/display:TreeChildren', TreeChildren, { instantiate: false });
register('Controls/display:TreeItem', TreeItem, { instantiate: false });
register('Controls/display:TreeItemDecorator', TreeItemDecorator, {
    instantiate: false,
});
register('Controls/display:NodeFooter', NodeFooter, { instantiate: false });
register('Controls/baseTree:SpaceCollectionItem', SpaceCollectionItem, {
    instantiate: false,
});
