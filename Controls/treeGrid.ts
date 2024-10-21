/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
/**
 * @library Controls/treeGrid
 * @includes ITreeGrid Controls/_treeGrid/interface/ITreeGrid
 * @includes IColumn Controls/_treeGrid/interface/IColumn
 * @includes IGroupNodeColumn Controls/_treeGrid/interface/IGroupNodeColumn
 * @includes ItemTemplate Controls/_treeGrid/interface/ItemTemplate
 * @includes NodeFooterTemplate Controls/_treeGrid/interface/NodeFooterTemplate
 * @includes NodeHeaderTemplate Controls/_treeGrid/interface/NodeHeaderTemplate
 * @includes TGroupNodeVisibility Controls/_treeGrid/interface/ITreeGrid/TGroupNodeVisibility
 * @public
 */

import { default as View } from 'Controls/_treeGrid/TreeGrid';
import { default as ItemsView } from 'Controls/_treeGrid/ItemsTreeGrid';
import TreeGridView, { ITreeGridOptions } from 'Controls/_treeGrid/TreeGridView';

import * as NodeFooterTemplate from 'wml!Controls/_treeGrid/render/NodeFooterTemplate';
import * as NodeHeaderTemplate from 'wml!Controls/_treeGrid/render/NodeHeaderTemplate';
import ItemTemplate from 'Controls/_treeGrid/compatibleLayer/ItemTemplate';
import 'Controls/baseTreeGrid';

export {
    View,
    ItemsView,
    TreeGridView,
    TreeGridViewTable,
    ItemTemplate,
    NodeFooterTemplate,
    NodeHeaderTemplate,
};

export { BaseTreeControlComponent, TOldBaseTreeControlCompatibility } from 'Controls/baseTree';

import TreeGridViewTable from './_treeGrid/TreeGridViewTable';
import { IGroupNodeColumn } from 'Controls/_treeGrid/interface/IGroupNodeColumn';
import ITreeGrid, { TGroupNodeVisibility } from 'Controls/_treeGrid/interface/ITreeGrid';
import { IColumn } from 'Controls/_treeGrid/interface/IColumn';
import { TreeGridControl, ITreeGridControlOptions } from 'Controls/_treeGrid/TreeGridControl';

export {
    TreeGridDataRow,
    TreeGridDataCell,
    TreeGridNodeHeaderRow,
    TreeGridNodeFooterRow,
    TreeGridNodeExtraItemCell,
    TreeGridGroupDataRow,
    TreeGridGroupDataCell,
    TreeGridHeaderRow,
    ITreeGridHeaderRowOptions,
    TreeGridResultsRow,
    GroupColumnTemplate,
    TGetTreeRowPropsCallback,
    TreeGridCollection,
    ITreeGridCollectionOptions,
} from 'Controls/baseTreeGrid';

export {
    ITreeGrid,
    TreeGridControl,
    ITreeGridControlOptions,
    IColumn,
    IGroupNodeColumn,
    TGroupNodeVisibility,
    ITreeGridOptions,
};

// region ReactRender
export { ExpanderConnectedComponent } from 'Controls/_treeGrid/renderReact/ExpanderConnectedComponent';
// endregion ReactRender
