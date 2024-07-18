/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { default as View } from 'Controls/_grid/Grid';
import {
    default as ItemsView,
    IItemsGridOptions as IItemsViewOptions,
} from 'Controls/_grid/ItemsGrid';
import GridView from 'Controls/_grid/GridView';

import 'Controls/baseGrid';

import {
    default as ItemTemplate,
    getReactViewProps as getGridItemTemplateProps,
} from 'Controls/_grid/compatibleLayer/ItemTemplate';
import {
    IItemProps as IGridItemProps,
    IItemsContainerPadding,
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
    EditArrowComponent,
    IEditArrowProps,
    EDIT_ARROW_SELECTOR,
} from 'Controls/listVisualAspects';

import { StickyLadderColumnTemplate } from 'Controls/baseGrid';
import { default as GroupTemplate } from 'Controls/_grid/Render/GroupCellComponent';
import { default as HeaderContent } from 'Controls/_grid/Render/HeaderCellComponent';
import { default as ResultColumnTemplate } from 'Controls/_grid/Render/ResultsCellComponent';
import { default as ResultsTemplate } from 'Controls/_grid/Render/ResultsCellComponent';
import { default as FooterColumnTemplate } from 'Controls/_grid/Render/FooterCellComponent';
import { default as FooterTemplate } from 'Controls/_grid/Render/FooterCellComponent';
import { default as ActionsCellComponent } from 'Controls/_grid/Render/ActionsCellComponent';
import { default as ItemsSpacingCellComponent } from 'Controls/_grid/Render/ItemsSpacingCellComponent';
import { default as ColumnResizerCellTemplate } from 'Controls/_grid/Render/ColumnResizerCellComponent';
import { default as ItemEditorTemplate } from 'Controls/_grid/Render/ItemEditorComponent';
import {
    ITrackedPropertiesTemplateProps,
    TrackedPropertiesComponentWrapper,
} from 'Controls/listVisualAspects';

import { IndicatorComponent } from 'Controls/listVisualAspects';

import {
    MoneyTypeRender,
    NumberTypeRender,
    DateTypeRender,
    StringTypeRender,
    StringSearchTypeRender,
    TypesLadderWrapper,
} from 'Controls/baseGrid';

import SortingButton from 'Controls/_grid/SortingButtonComponent';

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
    IItemsViewOptions,
    GridView,
    ItemTemplate,
    getGridItemTemplateProps,
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
    TrackedPropertiesComponentWrapper,
    ITrackedPropertiesTemplateProps,
    ItemsSpacingCellComponent,
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
    IndicatorComponent,
};

export { GridControl, IGridControlOptions } from 'Controls/_grid/GridControl';

export * from 'Controls/_grid/interface/IEditableGrid';

export {
    GridMixin,
    TColspanCallbackResult,
    TColspanCallback,
    TResultsColspanCallback,
    IEmptyTemplateColumn,
    IGridOptions,
    THeaderVisibility,
    TResultsVisibility,
    GridRowMixin,
    IInitializeColumnsOptions,
    IItemTemplateParams,
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
    TColumnsForCtor,
    THeaderForCtor,
    THeader,
    IHeaderCell,
    IFooterColumn,
    IGridControl,
    TResultsPosition,
    IGridAbstractColumn,
    IItemActionsCell,
    Colgroup,
    getRowComponentProps,
} from 'Controls/baseGrid';

import {
    Indicator,
    Trigger,
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
} from 'Controls/baseGrid';

export { DEFAULT_GROUP_CELL_Z_INDEX, FIXED_GROUP_CELL_Z_INDEX };

// region ReactRender

export { resolveViewControls } from 'Controls/_grid/utils/ReactViewControlsResolver';
export {
    isReactView,
    updateCollectionIfReactView,
    isReactColumns,
} from 'Controls/_grid/utils/PropsConverter';
export {
    getCellIndexByEventTarget,
    getCellIndexByEventTargetCommon,
    correctEventTargetFF,
    getCellElementByEventTarget,
} from 'Controls/_grid/utils/DomUtils';

// region ReactRender

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GridLoader = require('Controls/Utils/GridLoader');

export { GridLoader };

export {
    Indicator,
    Trigger,
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
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
    CheckboxCell,
    IGridItemProps,
    IItemsContainerPadding,
    TCellsIterator,
};
