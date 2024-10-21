import TreeGridCollection, {
    ITreeGridCollectionOptions,
} from 'Controls/_treeGridDisplay/TreeGridCollection';
import TreeGridDataRow from 'Controls/_treeGridDisplay/TreeGridDataRow';
import TreeGridDataCell from 'Controls/_treeGridDisplay/TreeGridDataCell';
import TreeGridNodeHeaderRow from 'Controls/_treeGridDisplay/TreeGridNodeHeaderRow';
import TreeGridNodeFooterRow from 'Controls/_treeGridDisplay/TreeGridNodeFooterRow';
import TreeGridNodeExtraItemCell from 'Controls/_treeGridDisplay/TreeGridNodeExtraItemCell';
import TreeGridGroupDataRow from 'Controls/_treeGridDisplay/TreeGridGroupDataRow';
import TreeGridGroupDataCell from 'Controls/_treeGridDisplay/TreeGridGroupDataCell';
import TreeGridHeaderRow, {
    ITreeGridHeaderRowOptions,
} from 'Controls/_treeGridDisplay/TreeGridHeaderRow';
import TreeGridResultsRow from 'Controls/_treeGridDisplay/TreeGridResultsRow';
import TreeGridNodeHeaderCell from 'Controls/_treeGridDisplay/TreeGridNodeHeaderCell';
import TreeGridNodeFooterCell from 'Controls/_treeGridDisplay/TreeGridNodeFooterCell';
import TreeGridFooterRow from 'Controls/_treeGridDisplay/TreeGridFooterRow';
import TreeGridTableHeaderRow from 'Controls/_treeGridDisplay/TreeGridTableHeaderRow';
import TreeGridHeader from 'Controls/_treeGridDisplay/TreeGridHeader';
import TreeGridTableHeader from 'Controls/_treeGridDisplay/TreeGridTableHeader';
import TreeGridSpaceRow from 'Controls/_treeGridDisplay/TreeGridSpaceRow';

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
    TreeGridNodeFooterCell,
    TreeGridNodeHeaderCell,
};

import { register } from 'Types/di';

//TODO: Controls/tree => Controls/treeGridDisplay
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
