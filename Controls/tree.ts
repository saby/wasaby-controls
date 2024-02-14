/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TreeControl } from 'Controls/_tree/TreeControl';
import { ITree, ITreeOptions as ITreeControlOptions } from 'Controls/baseTree';
import { default as ItemsView } from 'Controls/_tree/ItemsTree';
import TreeCollection, {IOptions as ITreeCollectionOptions} from 'Controls/_tree/display/TreeCollection';
import TreeNodeFooterItem from 'Controls/_tree/display/TreeNodeFooterItem';
import TreeNodeHeaderItem from 'Controls/_tree/display/TreeNodeHeaderItem';
import TreeItem, { IOptions as ITreeItemOptions } from 'Controls/_tree/display/TreeItem';
import { default as View } from 'Controls/_tree/Tree';
import { default as TreeView } from 'Controls/_tree/TreeView';
import { default as IItemTemplateOptions } from 'Controls/_tree/interface/ItemTemplate';
import { TreeSiblingStrategy } from 'Controls/baseTree';
import { register } from 'Types/di';

import NodeExtraItemTemplate from 'Controls/_tree/render/NodeExtraItemComponent';
import ItemTemplate from 'Controls/_tree/render/ItemComponent';

/**
 * Библиотека контролов, позволяющая работать с иерархией.
 * @library
 * @includes ItemTemplate Controls/_tree/interface/ItemTemplate
 * @includes NodeFooterTemplate Controls/_tree/interface/NodeFooterTemplate
 * @includes NodeHeaderTemplate Controls/_tree/interface/NodeHeaderTemplate
 * @includes ITree Controls/_baseTree/interface/ITree
 * @public
 */
export {
    TreeControl,
    ITreeControlOptions,
    ITree,
    ItemsView,
    TreeCollection,
    ITreeCollectionOptions,
    TreeItem,
    ITreeItemOptions,
    View,
    TreeView,
    TreeNodeFooterItem,
    TreeNodeHeaderItem,
    NodeExtraItemTemplate,
    NodeExtraItemTemplate as NodeFooterTemplate,
    NodeExtraItemTemplate as NodeFooterComponent,
    NodeExtraItemTemplate as NodeHeaderTemplate,
    NodeExtraItemTemplate as NodeHeaderComponent,
    ItemTemplate,
    ItemTemplate as ItemComponent,
    IItemTemplateOptions,
    TreeSiblingStrategy,
};

register('Controls/tree:TreeCollection', TreeCollection, {
    instantiate: false,
});
register('Controls/tree:TreeItem', TreeItem, { instantiate: false });
register('Controls/tree:TreeNodeFooterItem', TreeNodeFooterItem, {
    instantiate: false,
});
register('Controls/tree:TreeNodeHeaderItem', TreeNodeHeaderItem, {
    instantiate: false,
});
