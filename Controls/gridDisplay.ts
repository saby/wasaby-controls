/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import ColumnResizerCell from 'Controls/_gridDisplay/ColumnResizerCell';
import Indicator from 'Controls/_gridDisplay/Indicator';
import Trigger from 'Controls/_gridDisplay/Trigger';
import {
    default as GridCollection,
    IOptions as IGridCollectionOptions,
} from 'Controls/_gridDisplay/Collection';
import GridRow, { IOptions as IGridRowOptions } from 'Controls/_gridDisplay/Row';
import { default as GridItemActionsCell } from 'Controls/_gridDisplay/ItemActionsCell';
import GridCell, { IOptions as IGridCellOptions } from 'Controls/_gridDisplay/Cell';
import GridHeader, { IOptions as IGridHeaderOptions } from 'Controls/_gridDisplay/Header';
import GridHeaderRow, { IOptions as IGridHeaderRowOptions } from 'Controls/_gridDisplay/HeaderRow';
import GridHeaderCell, {
    IOptions as IGridHeaderCellOptions,
    ICellContentOrientation,
} from 'Controls/_gridDisplay/HeaderCell';
import SpaceRow from 'Controls/_gridDisplay/SpaceRow';
import SpaceCell from 'Controls/_gridDisplay/SpaceCell';
import GridStickyLadderCell, {
    IOptions as IGridStickyLadderCellOptions,
} from 'Controls/_gridDisplay/StickyLadderCell';
import GridEmptyRow, { IOptions as IGridEmptyRowOptions } from 'Controls/_gridDisplay/EmptyRow';
import GridEmptyCell, { IOptions as IGridEmptyCellOptions } from 'Controls/_gridDisplay/EmptyCell';
import GridTableHeader from 'Controls/_gridDisplay/TableHeader';
import GridTableHeaderRow from 'Controls/_gridDisplay/TableHeaderRow';
import GridDataRow, { IOptions as IGridDataRowOptions } from 'Controls/_gridDisplay/DataRow';
import GridDataCell, { IOptions as IGridDataCellOptions } from 'Controls/_gridDisplay/DataCell';
import GridResultsRow, {
    IOptions as IGridResultsRowOptions,
} from 'Controls/_gridDisplay/ResultsRow';
import GridResultsCell, {
    GRID_RESULTS_CELL_DEFAULT_TEMPLATE,
    IOptions as IGridResultsCellOptions,
} from 'Controls/_gridDisplay/ResultsCell';
import GridFooterRow, { IOptions as IGridFooterRowOptions } from 'Controls/_gridDisplay/FooterRow';
import GridFooterCell, {
    IOptions as IGridFooterCellOptions,
} from 'Controls/_gridDisplay/FooterCell';
import GridGroupRow, { IOptions as IGridGroupRowOptions } from 'Controls/_gridDisplay/GroupRow';
import GridGroupCell, { IOptions as IGridGroupCellOptions } from 'Controls/_gridDisplay/GroupCell';
import {
    DEFAULT_GROUP_CELL_Z_INDEX,
    FIXED_GROUP_CELL_Z_INDEX,
} from 'Controls/_gridDisplay/GroupCell';

// region ReactRender
import {
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
} from 'Controls/_gridDisplay/interface/IDisplaySearchValue';
import CheckboxCell from 'Controls/_gridDisplay/CheckboxCell';
import { TCellsIterator } from 'Controls/_gridDisplay/mixins/Row';
import { register } from 'Types/di';

/**
 * Библиотека с общим функционалом для grid
 * @library
 * @embedded
 */

export { IDataTypeRenderProps } from 'Controls/_gridDisplay/interface/IDataTypeRenderProps';

export {
    Trigger,
    Indicator,
    ColumnResizerCell,
    GridCollection,
    IGridCollectionOptions,
    GridRow,
    IGridRowOptions,
    GridItemActionsCell,
    GridCell,
    IGridCellOptions,
    GridHeader,
    IGridHeaderOptions,
    GridHeaderRow,
    IGridHeaderRowOptions,
    GridHeaderCell,
    IGridHeaderCellOptions,
    ICellContentOrientation,
    SpaceRow,
    SpaceCell,
    GridStickyLadderCell,
    IGridStickyLadderCellOptions,
    GridEmptyRow,
    IGridEmptyRowOptions,
    GridEmptyCell,
    IGridEmptyCellOptions,
    GridTableHeader,
    GridTableHeaderRow,
    GridDataRow,
    IGridDataRowOptions,
    GridDataCell,
    IGridDataCellOptions,
    GridResultsRow,
    IGridResultsRowOptions,
    GridResultsCell,
    GRID_RESULTS_CELL_DEFAULT_TEMPLATE,
    IGridResultsCellOptions,
    GridFooterRow,
    IGridFooterRowOptions,
    GridFooterCell,
    IGridFooterCellOptions,
    GridGroupRow,
    IGridGroupRowOptions,
    GridGroupCell,
    IGridGroupCellOptions,
    DEFAULT_GROUP_CELL_Z_INDEX,
    FIXED_GROUP_CELL_Z_INDEX,
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
    CheckboxCell,
    TCellsIterator,
};

export { COLUMN_SCROLL_SELECTORS } from 'Controls/_gridDisplay/constants';

export {
    default as GridMixin,
    TColspanCallbackResult,
    TColspanCallback,
    TResultsColspanCallback,
    IEmptyTemplateColumn,
    IOptions as IGridOptions,
    THeaderVisibility,
    TResultsVisibility,
} from 'Controls/_gridDisplay/mixins/Grid';
export {
    default as GridRowMixin,
    IInitializeColumnsOptions,
} from 'Controls/_gridDisplay/mixins/Row';
export { IItemTemplateParams } from 'Controls/_gridDisplay/mixins/Row';
export {
    TColumns,
    IColumn,
    IColspanParams,
    ICellPadding,
    TCellHorizontalAlign,
    TCellPaddingVariant,
    TCellVerticalAlign,
    TOverflow,
    IColumnSeparatorSizeConfig,
    TColumnSeparatorSize,
} from 'Controls/_gridDisplay/interface/IColumn';
export {
    TColumns as TColumnsForCtor,
    THeader as THeaderForCtor,
} from 'Controls/_gridDisplay/interface/IColumnForCtor';
export { THeader, IHeaderCell } from 'Controls/_gridDisplay/interface/IHeaderCell';
export { IFooterColumn } from 'Controls/_gridDisplay/interface/IFooterColumn';
export { IGridControl, TResultsPosition } from 'Controls/_gridDisplay/interface/IGridControl';
export { IGridAbstractColumn } from 'Controls/_gridDisplay/interface/IGridAbstractColumn';
export { default as IItemActionsCell } from 'Controls/_gridDisplay/interface/IItemActionsCell';
export { default as Colgroup } from 'Controls/_gridDisplay/Colgroup';
export { TFooter } from 'Controls/_gridDisplay/interface/IFooter';
export { TEmptyTemplateColumns } from 'Controls/_gridDisplay/interface/IEmptyTemplateColumns';
export { getRowComponentProps } from 'Controls/_gridDisplay/utils/RowComponent';
export { calcRowPadding as calcRowPadding } from 'Controls/_gridDisplay/utils/Padding';
export * as CursorUtils from 'Controls/_gridDisplay/utils/Cursor';

//TODO: Controls/grid => Controls/gridDisplay
register('Controls/grid:GridCollection', GridCollection, {
    instantiate: false,
});
register('Controls/grid:GridRow', GridRow, { instantiate: false });
register('Controls/grid:GridCell', GridCell, { instantiate: false });
register('Controls/grid:GridHeader', GridHeader, { instantiate: false });
register('Controls/grid:GridTableHeader', GridTableHeader, {
    instantiate: false,
});
register('Controls/grid:GridHeaderRow', GridHeaderRow, { instantiate: false });
register('Controls/grid:GridTableHeaderRow', GridTableHeaderRow, {
    instantiate: false,
});
register('Controls/grid:GridHeaderCell', GridHeaderCell, {
    instantiate: false,
});
register('Controls/grid:GridEmptyRow', GridEmptyRow, { instantiate: false });
register('Controls/grid:GridEmptyCell', GridEmptyCell, { instantiate: false });
register('Controls/grid:GridDataRow', GridDataRow, { instantiate: false });
register('Controls/grid:GridDataCell', GridDataCell, { instantiate: false });
register('Controls/grid:GridFooterCell', GridFooterCell, {
    instantiate: false,
});
register('Controls/grid:GridResultsCell', GridResultsCell, {
    instantiate: false,
});
register('Controls/display:GridGroupCell', GridGroupCell, {
    instantiate: false,
});
register('Controls/grid:GridGroupCell', GridGroupCell, { instantiate: false });
register('Controls/grid:GridGroupRow', GridGroupRow, { instantiate: false });
register('Controls/grid:Indicator', Indicator, { instantiate: false });
register('Controls/grid:Trigger', Trigger, { instantiate: false });
register('Controls/grid:SpaceRow', SpaceRow, { instantiate: false });
register('Controls/grid:SpaceCell', SpaceCell, { instantiate: false });
