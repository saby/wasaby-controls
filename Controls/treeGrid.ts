/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
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

import GroupColumnTemplate from 'Controls/_treeGrid/renderReact/GroupCellContent';
import * as NodeFooterTemplate from 'wml!Controls/_treeGrid/render/NodeFooterTemplate';
import * as NodeHeaderTemplate from 'wml!Controls/_treeGrid/render/NodeHeaderTemplate';

import ItemTemplate from 'Controls/_treeGrid/renderReact/Item';

export {
    View,
    ItemsView,
    TreeGridView,
    TreeGridViewTable,
    ItemTemplate,
    NodeFooterTemplate,
    NodeHeaderTemplate,
    GroupColumnTemplate,
};

import { register } from 'Types/di';
import TreeGridCollection, {
    ITreeGridCollectionOptions,
} from 'Controls/_treeGrid/display/TreeGridCollection';
import TreeGridDataRow from 'Controls/_treeGrid/display/TreeGridDataRow';
import TreeGridDataCell from 'Controls/_treeGrid/display/TreeGridDataCell';
import TreeGridNodeHeaderRow from 'Controls/_treeGrid/display/TreeGridNodeHeaderRow';
import TreeGridNodeFooterRow from 'Controls/_treeGrid/display/TreeGridNodeFooterRow';
import TreeGridNodeExtraItemCell from 'Controls/_treeGrid/display/TreeGridNodeExtraItemCell';
import TreeGridNodeFooterCell from 'Controls/_treeGrid/display/TreeGridNodeFooterCell';
import TreeGridNodeHeaderCell from 'Controls/_treeGrid/display/TreeGridNodeHeaderCell';
import TreeGridFooterRow from 'Controls/_treeGrid/display/TreeGridFooterRow';
import TreeGridFooterCell from 'Controls/_treeGrid/display/TreeGridFooterCell';
import TreeGridGroupDataRow from 'Controls/_treeGrid/display/TreeGridGroupDataRow';
import TreeGridGroupDataCell from 'Controls/_treeGrid/display/TreeGridGroupDataCell';
import TreeGridViewTable from './_treeGrid/TreeGridViewTable';
import { IGroupNodeColumn } from 'Controls/_treeGrid/interface/IGroupNodeColumn';
import ITreeGrid, { TGroupNodeVisibility } from 'Controls/_treeGrid/interface/ITreeGrid';
import { IColumn } from 'Controls/_treeGrid/interface/IColumn';
import TreeGridHeaderRow from 'Controls/_treeGrid/display/TreeGridHeaderRow';
import TreeGridHeaderCell from 'Controls/_treeGrid/display/TreeGridHeaderCell';
import TreeGridTableHeaderRow from 'Controls/_treeGrid/display/TreeGridTableHeaderRow';
import TreeGridHeader from 'Controls/_treeGrid/display/TreeGridHeader';
import TreeGridTableHeader from 'Controls/_treeGrid/display/TreeGridTableHeader';
import TreeGridSpaceRow from 'Controls/_treeGrid/display/TreeGridSpaceRow';
import { TreeGridControl, ITreeGridControlOptions } from 'Controls/_treeGrid/TreeGridControl';

export {
    ITreeGrid,
    TreeGridControl,
    ITreeGridControlOptions,
    IColumn,
    TreeGridHeaderCell,
    TreeGridFooterCell,
    TreeGridCollection,
    ITreeGridCollectionOptions,
    TreeGridDataRow,
    TreeGridDataCell,
    TreeGridNodeFooterRow,
    TreeGridNodeHeaderRow,
    TreeGridNodeExtraItemCell,
    TreeGridGroupDataRow,
    TreeGridGroupDataCell,
    IGroupNodeColumn,
    TGroupNodeVisibility,
    ITreeGridOptions,
};

// region ReactRender
export { TGetTreeRowPropsCallback } from 'Controls/_treeGrid/renderReact/CellRenderWithExpander';
// endregion ReactRender

register('Controls/treeGrid:TreeGridCollection', TreeGridCollection, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridDataRow', TreeGridDataRow, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridDataCell', TreeGridDataCell, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridNodeFooterRow', TreeGridNodeFooterRow, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridNodeHeaderRow', TreeGridNodeHeaderRow, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridNodeExtraItemCell', TreeGridNodeExtraItemCell, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridNodeHeaderCell', TreeGridNodeHeaderCell, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridNodeFooterCell', TreeGridNodeFooterCell, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridFooterRow', TreeGridFooterRow, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridFooterCell', TreeGridFooterCell, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridHeaderRow', TreeGridHeaderRow, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridHeaderCell', TreeGridHeaderCell, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridTableHeaderRow', TreeGridTableHeaderRow, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridGroupDataRow', TreeGridGroupDataRow, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridGroupDataCell', TreeGridGroupDataCell, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridHeader', TreeGridHeader, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridTableHeader', TreeGridTableHeader, {
    instantiate: false,
});
register('Controls/treeGrid:TreeGridSpaceRow', TreeGridSpaceRow, {
    instantiate: false,
});
