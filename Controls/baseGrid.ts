/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import ColumnResizerCell from 'Controls/_baseGrid/display/ColumnResizerCell';
import Indicator from 'Controls/_baseGrid/display/Indicator';
import Trigger from 'Controls/_baseGrid/display/Trigger';
import {
    default as GridCollection,
    IOptions as IGridCollectionOptions,
} from 'Controls/_baseGrid/display/Collection';
import GridRow, { IOptions as IGridRowOptions } from 'Controls/_baseGrid/display/Row';
import { default as GridItemActionsCell } from 'Controls/_baseGrid/display/ItemActionsCell';
import GridCell, { IOptions as IGridCellOptions } from 'Controls/_baseGrid/display/Cell';
import GridHeader, { IOptions as IGridHeaderOptions } from 'Controls/_baseGrid/display/Header';
import GridHeaderRow, {
    IOptions as IGridHeaderRowOptions,
} from 'Controls/_baseGrid/display/HeaderRow';
import GridHeaderCell, {
    IOptions as IGridHeaderCellOptions,
    ICellContentOrientation,
} from 'Controls/_baseGrid/display/HeaderCell';
import SpaceRow from 'Controls/_baseGrid/display/SpaceRow';
import SpaceCell from 'Controls/_baseGrid/display/SpaceCell';
import GridStickyLadderCell, {
    IOptions as IGridStickyLadderCellOptions,
} from 'Controls/_baseGrid/display/StickyLadderCell';
import GridEmptyRow, {
    IOptions as IGridEmptyRowOptions,
} from 'Controls/_baseGrid/display/EmptyRow';
import GridEmptyCell, {
    IOptions as IGridEmptyCellOptions,
} from 'Controls/_baseGrid/display/EmptyCell';
import GridTableHeader from 'Controls/_baseGrid/display/TableHeader';
import GridTableHeaderRow from 'Controls/_baseGrid/display/TableHeaderRow';
import GridDataRow, { IOptions as IGridDataRowOptions } from 'Controls/_baseGrid/display/DataRow';
import GridDataCell, {
    IOptions as IGridDataCellOptions,
} from 'Controls/_baseGrid/display/DataCell';
import GridResultsRow, {
    IOptions as IGridResultsRowOptions,
} from 'Controls/_baseGrid/display/ResultsRow';
import GridResultsCell, {
    GRID_RESULTS_CELL_DEFAULT_TEMPLATE,
    IOptions as IGridResultsCellOptions,
} from 'Controls/_baseGrid/display/ResultsCell';
import GridFooterRow, {
    IOptions as IGridFooterRowOptions,
} from 'Controls/_baseGrid/display/FooterRow';
import GridFooterCell, {
    IOptions as IGridFooterCellOptions,
} from 'Controls/_baseGrid/display/FooterCell';
import GridGroupRow, {
    IOptions as IGridGroupRowOptions,
} from 'Controls/_baseGrid/display/GroupRow';
import GridGroupCell, {
    IOptions as IGridGroupCellOptions,
} from 'Controls/_baseGrid/display/GroupCell';
import {
    DEFAULT_GROUP_CELL_Z_INDEX,
    FIXED_GROUP_CELL_Z_INDEX,
} from 'Controls/_baseGrid/display/GroupCell';
import { COLUMN_SCROLL_SELECTORS } from 'Controls/_baseGrid/display/constants';

export { getRowComponentProps } from 'Controls/_baseGrid/row/utils/RowComponent';
export { calcRowPadding as calcRowPadding } from 'Controls/_baseGrid/row/utils/props/Padding';
export * as CursorUtils from 'Controls/_baseGrid/cell/utils/props/Cursor';

// region ReactRender
import {
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
} from 'Controls/_baseGrid/display/interface/IDisplaySearchValue';
import CheckboxCell from 'Controls/_baseGrid/display/CheckboxCell';
import { TCellsIterator } from 'Controls/_baseGrid/display/mixins/Row';
import MoneyTypeRender from 'Controls/_baseGrid/Render/types/MoneyRender';
import NumberTypeRender from 'Controls/_baseGrid/Render/types/NumberRender';
import DateTypeRender from 'Controls/_baseGrid/Render/types/DateRender';
import StringTypeRender from 'Controls/_baseGrid/Render/types/StringRender';
import StringSearchTypeRender from 'Controls/_baseGrid/Render/types/StringSearchRender';
import TypesLadderWrapper from 'Controls/_baseGrid/Render/types/LadderWrapper';
import { register } from 'Types/di';

/**
 * Библиотека с общим функционалом для grid
 * @library
 * @embedded
 */

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
    COLUMN_SCROLL_SELECTORS,
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
    MoneyTypeRender,
    NumberTypeRender,
    DateTypeRender,
    StringTypeRender,
    StringSearchTypeRender,
    TypesLadderWrapper,
};

export {
    default as GridMixin,
    TColspanCallbackResult,
    TColspanCallback,
    TResultsColspanCallback,
    IEmptyTemplateColumn,
    IOptions as IGridOptions,
    THeaderVisibility,
    TResultsVisibility,
} from 'Controls/_baseGrid/display/mixins/Grid';
export {
    default as GridRowMixin,
    IInitializeColumnsOptions,
} from 'Controls/_baseGrid/display/mixins/Row';
export { IItemTemplateParams } from 'Controls/_baseGrid/display/mixins/Row';
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
} from 'Controls/_baseGrid/display/interface/IColumn';
export {
    TColumns as TColumnsForCtor,
    THeader as THeaderForCtor,
} from 'Controls/_baseGrid/display/interface/IColumnForCtor';
export { THeader, IHeaderCell } from 'Controls/_baseGrid/display/interface/IHeaderCell';
export { IFooterColumn } from 'Controls/_baseGrid/display/interface/IFooterColumn';
export { IGridControl, TResultsPosition } from 'Controls/_baseGrid/display/interface/IGridControl';
export { IGridAbstractColumn } from 'Controls/_baseGrid/display/interface/IGridAbstractColumn';
export { default as IItemActionsCell } from 'Controls/_baseGrid/display/interface/IItemActionsCell';
export { default as Colgroup } from 'Controls/_baseGrid/display/Colgroup';
export { TFooter } from 'Controls/_baseGrid/display/interface/IFooter';
export { TEmptyTemplateColumns } from 'Controls/_baseGrid/display/interface/IEmptyTemplateColumns';

//TODO: Controls/grid => Controls/baseGrid
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