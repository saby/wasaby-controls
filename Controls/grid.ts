/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { default as View } from 'Controls/_grid/Grid';
import { default as ItemsView } from 'Controls/_grid/ItemsGrid';
import GridView from 'Controls/_grid/GridView';

import {
    default as ItemTemplate,
    IItemProps as IGridItemProps,
} from 'Controls/_grid/RenderReact/Item';
import {
    default as ColumnTemplate,
    ICellProps as IColumnTemplateProps,
} from 'Controls/_grid/RenderReact/Cell';
import {
    default as EmptyTemplate,
    default as EmptyColumnTemplate,
} from 'Controls/_grid/RenderReact/EmptyCellContent';
import {
    default as EditArrowComponent,
    IProps as IEditArrowProps,
    EDIT_ARROW_SELECTOR,
} from 'Controls/_grid/RenderReact/EditArrowComponent';

import { default as StickyLadderColumnTemplate } from 'Controls/_grid/Render/grid/StickyLadderCellComponent';
import { default as GroupTemplate } from 'Controls/_grid/Render/GroupCellComponent';
import { default as HeaderContent } from 'Controls/_grid/Render/HeaderCellComponent';
import { default as ResultColumnTemplate } from 'Controls/_grid/Render/ResultsCellComponent';
import { default as ResultsTemplate } from 'Controls/_grid/Render/ResultsCellComponent';
import { default as FooterColumnTemplate } from 'Controls/_grid/Render/FooterCellComponent';
import { default as FooterTemplate } from 'Controls/_grid/Render/FooterCellComponent';
import { default as ActionsCellComponent } from 'Controls/_grid/Render/ActionsCellComponent';
import { default as ColumnResizerCellTemplate } from 'Controls/_grid/Render/ColumnResizerCellComponent';
import { default as ItemEditorTemplate } from 'Controls/_grid/Render/ItemEditorComponent';
import Indicator from 'Controls/_grid/display/Indicator';
import Trigger from 'Controls/_grid/display/Trigger';

export { Trigger };
export { Indicator };
export { default as IndicatorComponent } from 'Controls/_grid/Render/grid/IndicatorComponent';

import MoneyTypeRender from 'Controls/_grid/Render/types/MoneyRender';
import NumberTypeRender from 'Controls/_grid/Render/types/NumberRender';
import DateTypeRender from 'Controls/_grid/Render/types/DateRender';
import StringTypeRender from 'Controls/_grid/Render/types/StringRender';
import StringSearchTypeRender from 'Controls/_grid/Render/types/StringSearchRender';
import TypesLadderWrapper from 'Controls/_grid/Render/types/LadderWrapper';

import ColumnResizerCell from 'Controls/_grid/display/ColumnResizerCell';
import SortingButton from 'Controls/_grid/SortingButtonComponent';
import { register } from 'Types/di';

/**
 * Библиотека контролов, которые реализуют плоский список, отображающийся в виде {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицы}.
 * @library
 * @includes ItemTemplate Controls/_grid/interface/ItemTemplate
 * @includes ResultsTemplate Controls/_grid/interface/ResultsTemplate
 * @includes GroupTemplate Controls/_grid/Render/GroupCellComponent
 * @includes HeaderContent Controls/_grid/Render/HeaderCellComponent
 * @includes ColumnTemplate Controls/_grid/interface/ColumnTemplate
 * @includes ResultColumnTemplate Controls/_grid/interface/ResultColumnTemplate
 * @includes EditingEmptyTemplate Controls/_grid/interface/EditingEmptyTemplate
 * @includes FooterTemplate Controls/_grid/interface/FooterTemplate
 * @includes EmptyTemplate Controls/_grid/interface/EmptyTemplate
 * @includes EmptyColumnTemplate Controls/_grid/interface/EmptyColumnTemplate
 * @includes RowEditor Controls/_grid/interface/RowEditor
 * @includes IPropStorage Controls/_grid/interface/IPropStorage
 * @includes SortingButton Controls/_grid/SortingButtonComponent
 * @includes ItemEditorTemplate Controls/_grid/interface/IitemEditorTemplate
 * @includes IEditableGrid Controls/_grid/interface/IEditableGrid
 * @includes IGridEditingConfig Controls/_grid/interface/IGridEditingConfig
 * @includes IItemAddOptions Controls/_grid/interface/IItemAddOptions
 * @includes IItemEditOptions Controls/_grid/interface/IItemEditOptions
 * @public
 */

export {
    View,
    ItemsView,
    GridView,
    ItemTemplate,
    ItemEditorTemplate,
    ResultsTemplate,
    ResultColumnTemplate,
    ColumnTemplate,
    IColumnTemplateProps,
    IEditArrowProps,
    TypesLadderWrapper,
    StickyLadderColumnTemplate,
    GroupTemplate,
    HeaderContent,
    FooterTemplate,
    FooterColumnTemplate,
    ActionsCellComponent,
    ColumnResizerCell,
    ColumnResizerCellTemplate,
    EmptyTemplate,
    EmptyColumnTemplate,
    EditArrowComponent,
    MoneyTypeRender,
    NumberTypeRender,
    DateTypeRender,
    StringTypeRender,
    StringSearchTypeRender,
    SortingButton,
    EDIT_ARROW_SELECTOR,
};

import {
    default as GridCollection,
    IOptions as IGridCollectionOptions,
} from 'Controls/_grid/display/Collection';

export { GridControl, IGridControlOptions } from 'Controls/_grid/GridControl';

export {
    default as GridMixin,
    TColspanCallbackResult,
    TColspanCallback,
    TResultsColspanCallback,
    IEmptyTemplateColumn,
    IOptions as IGridOptions,
    THeaderVisibility,
    TResultsVisibility,
} from 'Controls/_grid/display/mixins/Grid';
export {
    default as GridRowMixin,
    IInitializeColumnsOptions,
} from 'Controls/_grid/display/mixins/Row';
export { IItemTemplateParams } from 'Controls/_grid/display/mixins/Row';

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
} from 'Controls/_grid/display/interface/IColumn';

export { THeader, IHeaderCell } from 'Controls/_grid/display/interface/IHeaderCell';

export { IFooterColumn } from 'Controls/_grid/display/interface/IFooterColumn';

export { IGridControl, TResultsPosition } from 'Controls/_grid/display/interface/IGridControl';
export { IGridAbstractColumn } from 'Controls/_grid/display/interface/IGridAbstractColumn';
export { default as IItemActionsCell } from 'Controls/_grid/display/interface/IItemActionsCell';

export * from 'Controls/_grid/interface/IEditableGrid';

export { default as Colgroup } from './_grid/display/Colgroup';

import GridRow, { IOptions as IGridRowOptions } from 'Controls/_grid/display/Row';
import { default as GridItemActionsCell } from 'Controls/_grid/display/ItemActionsCell';
import GridCell, { IOptions as IGridCellOptions } from 'Controls/_grid/display/Cell';
import GridHeader, { IOptions as IGridHeaderOptions } from 'Controls/_grid/display/Header';
import GridHeaderRow, { IOptions as IGridHeaderRowOptions } from 'Controls/_grid/display/HeaderRow';
import GridHeaderCell, {
    IOptions as IGridHeaderCellOptions,
} from 'Controls/_grid/display/HeaderCell';
import SpaceRow from 'Controls/_grid/display/SpaceRow';
import SpaceCell from 'Controls/_grid/display/SpaceCell';

import GridStickyLadderCell, {
    IOptions as IGridStickyLadderCellOptions,
} from 'Controls/_grid/display/StickyLadderCell';

import GridEmptyRow, { IOptions as IGridEmptyRowOptions } from 'Controls/_grid/display/EmptyRow';
import GridEmptyCell, { IOptions as IGridEmptyCellOptions } from 'Controls/_grid/display/EmptyCell';

import GridTableHeader from 'Controls/_grid/display/TableHeader';
import GridTableHeaderRow from 'Controls/_grid/display/TableHeaderRow';

import GridDataRow, { IOptions as IGridDataRowOptions } from 'Controls/_grid/display/DataRow';
import GridDataCell, { IOptions as IGridDataCellOptions } from 'Controls/_grid/display/DataCell';

import GridResultsRow, {
    IOptions as IGridResultsRowOptions,
} from 'Controls/_grid/display/ResultsRow';
import GridResultsCell, {
    GRID_RESULTS_CELL_DEFAULT_TEMPLATE,
    IOptions as IGridResultsCellOptions,
} from 'Controls/_grid/display/ResultsCell';

import GridFooterRow, { IOptions as IGridFooterRowOptions } from 'Controls/_grid/display/FooterRow';
import GridFooterCell, {
    IOptions as IGridFooterCellOptions,
} from 'Controls/_grid/display/FooterCell';
import GridGroupRow, { IOptions as IGridGroupRowOptions } from 'Controls/_grid/display/GroupRow';
import GridGroupCell, { IOptions as IGridGroupCellOptions } from 'Controls/_grid/display/GroupCell';
import {
    DEFAULT_GROUP_CELL_Z_INDEX,
    FIXED_GROUP_CELL_Z_INDEX,
} from 'Controls/_grid/display/GroupCell';
export { DEFAULT_GROUP_CELL_Z_INDEX, FIXED_GROUP_CELL_Z_INDEX };

// region ReactRender

export { resolveViewControls } from 'Controls/_grid/utils/ReactViewControlsResolver';
export {
    isReactView,
    updateCollectionIfReactView,
    isReactColumns,
} from 'Controls/_grid/utils/PropsConverter';
export { getRowComponentProps } from 'Controls/_grid/display/ReactRenderUtils';
export {
    getCellIndexByEventTarget,
    getCellIndexByEventTargetCommon,
} from 'Controls/_grid/utils/DomUtils';

// region ReactRender

import {
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
} from 'Controls/_grid/display/interface/IDisplaySearchValue';
import CheckboxCell from 'Controls/_grid/display/CheckboxCell';

import { TCellsIterator } from 'Controls/_grid/display/mixins/Row';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GridLoader = require('Controls/Utils/GridLoader');
export { GridLoader };

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

export {
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
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
    CheckboxCell,
    SpaceRow,
    SpaceCell,
    IGridItemProps,
    TCellsIterator,
};
