import AdjacencyList from 'Controls/_baseTreeDisplay/strategies/AdjacencyList';
import NodeFooterStrategy from 'Controls/_baseTreeDisplay/strategies/NodeFooter';
import NodeHeaderStrategy from 'Controls/_baseTreeDisplay/strategies/NodeHeader';
import ExtraNodeItemStrategy from 'Controls/_baseTreeDisplay/strategies/ExtraNodeItem';
import RootStrategy from 'Controls/_baseTreeDisplay/strategies/Root';
import RootSeparatorStrategy from 'Controls/_baseTreeDisplay/strategies/RootSeparator';
import TreeDragStrategy from 'Controls/_baseTreeDisplay/strategies/TreeDrag';
import SearchStrategy from 'Controls/_baseTreeDisplay/strategies/Search';
import MaterializedPathStrategy, {
    IOptions as IMaterializedPathStrategyOptions,
} from 'Controls/_baseTreeDisplay/strategies/MaterializedPath';
import {
    ITreeStrategyOptions,
    TreeSiblingStrategy,
} from 'Controls/_baseTreeDisplay/dataStrategies/TreeSiblingStrategy';
import TreeChildren from 'Controls/_baseTreeDisplay/TreeChildren';
import BreadcrumbsItem from 'Controls/_baseTreeDisplay/BreadcrumbsItem';
import Tree, {
    NODE_TYPE_PROPERTY_GROUP,
    IOptions as ITreeCollectionOptions,
    IHasMoreStorage,
} from 'Controls/_baseTreeDisplay/Tree';
import TreeItem, { IOptions as ITreeItemOptions } from 'Controls/_baseTreeDisplay/TreeItem';
import NodeFooter from 'Controls/_baseTreeDisplay/NodeFooter';
import RootSeparatorItem from 'Controls/_baseTreeDisplay/RootSeparatorItem';
import TreeItemDecorator from 'Controls/_baseTreeDisplay/TreeItemDecorator';
import { SpaceCollectionItem } from 'Controls/_baseTreeDisplay/SpaceCollectionItem';
import Search from 'Controls/_baseTreeDisplay/Search';
import NodeFooterMixin from 'Controls/_baseTreeDisplay/NodeFooterMixin';
import { TChildrenLoadMode } from 'Controls/_baseTreeDisplay/interface/ITree';

export {
    TreeSiblingStrategy,
    ITreeStrategyOptions,
    NODE_TYPE_PROPERTY_GROUP,
    Tree,
    ITreeCollectionOptions,
    IHasMoreStorage,
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
    NodeFooterMixin,
    TChildrenLoadMode,
};

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