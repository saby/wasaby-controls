/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeGridCollection, {
    ITreeGridCollectionOptions,
} from 'Controls/_baseTreeGrid/display/TreeGridCollection';
import TreeGridDataRow from 'Controls/_baseTreeGrid/display/TreeGridDataRow';
import TreeGridDataCell from 'Controls/_baseTreeGrid/display/TreeGridDataCell';
import TreeGridNodeHeaderRow from 'Controls/_baseTreeGrid/display/TreeGridNodeHeaderRow';
import TreeGridNodeFooterRow from 'Controls/_baseTreeGrid/display/TreeGridNodeFooterRow';
import TreeGridNodeExtraItemCell from 'Controls/_baseTreeGrid/display/TreeGridNodeExtraItemCell';
import TreeGridGroupDataRow from 'Controls/_baseTreeGrid/display/TreeGridGroupDataRow';
import TreeGridGroupDataCell from 'Controls/_baseTreeGrid/display/TreeGridGroupDataCell';
import TreeGridHeaderRow, {
    ITreeGridHeaderRowOptions,
} from 'Controls/_baseTreeGrid/display/TreeGridHeaderRow';
import TreeGridResultsRow from 'Controls/_baseTreeGrid/display/TreeGridResultsRow';
import { register } from 'Types/di';
import TreeGridNodeHeaderCell from 'Controls/_baseTreeGrid/display/TreeGridNodeHeaderCell';
import TreeGridNodeFooterCell from 'Controls/_baseTreeGrid/display/TreeGridNodeFooterCell';
import TreeGridFooterRow from 'Controls/_baseTreeGrid/display/TreeGridFooterRow';
import TreeGridTableHeaderRow from 'Controls/_baseTreeGrid/display/TreeGridTableHeaderRow';
import TreeGridHeader from 'Controls/_baseTreeGrid/display/TreeGridHeader';
import TreeGridTableHeader from 'Controls/_baseTreeGrid/display/TreeGridTableHeader';
import TreeGridSpaceRow from 'Controls/_baseTreeGrid/display/TreeGridSpaceRow';
import GroupColumnTemplate from 'Controls/_baseTreeGrid/renderReact/GroupCellContent';
import { TGetTreeRowPropsCallback } from 'Controls/_baseTreeGrid/renderReact/CellRenderWithExpander';

export {
    TreeGridCollection,
    ITreeGridCollectionOptions,
    TreeGridDataRow,
    TreeGridDataCell,
    TreeGridNodeFooterRow,
    TreeGridNodeHeaderRow,
    TreeGridNodeExtraItemCell,
    TreeGridGroupDataRow,
    TreeGridGroupDataCell,
    TreeGridResultsRow,
    TreeGridHeaderRow,
    ITreeGridHeaderRowOptions,
    GroupColumnTemplate,
    TGetTreeRowPropsCallback,
};

//TODO: Controls/tree => Controls/baseTreeGrid
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
register('Controls/treeGrid:TreeGridHeaderRow', TreeGridHeaderRow, {
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
register('Controls/treeGrid:TreeGridResultsRow', TreeGridResultsRow, {
    instantiate: false,
});
