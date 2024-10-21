/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { default as View } from 'Controls/_grid/Grid';
import {
    default as ItemsView,
    IItemsGridOptions as IItemsViewOptions,
} from 'Controls/_grid/ItemsGrid';

import 'Controls/gridDisplay';
import 'Controls/gridColumnScroll';

import {
    CompatibleGridRowComponent as ItemTemplate,
    getCompatibleGridRowComponentProps,
    CompatibleRowComponentPropsConverter,
} from 'Controls/_grid/compatibleLayer/RowComponent';
import {
    ICompatibleRowComponentProps as IGridItemProps,
    IItemsContainerPadding,
} from 'Controls/_grid/compatibleLayer/row/interface';
import {
    CompatibleGridCellComponent as ColumnTemplate,
    CompatibleCellComponentPropsConverter,
    getCompatibleGridCellComponentProps,
    getCompatibleCellContentRender,
    CompatibleGridCellComponent as ItemEditorTemplate,
} from 'Controls/_grid/compatibleLayer/CellComponent';
import {
    ICompatibleCellComponentProps as IColumnTemplateProps,
    ICompatibleCellComponentPropsConverterProps,
} from 'Controls/_grid/compatibleLayer/cell/interface';
import {
    EditArrowComponent,
    IEditArrowProps,
    EDIT_ARROW_SELECTOR,
} from 'Controls/listVisualAspects';

import { CompatibleGridGroupCellComponent as GroupTemplate } from 'Controls/_grid/compatibleLayer/GroupCellComponent';
import { default as GroupCellComponent } from 'Controls/_grid/cleanRender/cell/GroupCellComponent';
import {
    default as BaseCellComponent,
    IBaseCellComponentProps,
} from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { CompatibleHeaderCellComponent as HeaderContent } from 'Controls/_grid/compatibleLayer/HeaderCellComponent';
import { CompatibleResultsCellComponent as ResultColumnTemplate } from 'Controls/_grid/compatibleLayer/ResultsCellComponent';
import { CompatibleResultsCellComponent as ResultsTemplate } from 'Controls/_grid/compatibleLayer/ResultsCellComponent';
import { CompatibleFooterCellComponent as FooterColumnTemplate } from 'Controls/_grid/compatibleLayer/FooterCellComponent';
import { CompatibleFooterCellComponent as FooterTemplate } from 'Controls/_grid/compatibleLayer/FooterCellComponent';
import {
    CompatibleEmptyCellComponent as EmptyTemplate,
    CompatibleEmptyCellComponent as EmptyColumnTemplate,
} from 'Controls/_grid/compatibleLayer/EmptyCellComponent';

import {
    ITrackedPropertiesTemplateProps,
    TrackedPropertiesComponentWrapper,
} from 'Controls/listVisualAspects';

import { IndicatorComponent } from 'Controls/listVisualAspects';

import {
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
    CheckboxCell,
    TCellsIterator,
} from 'Controls/gridDisplay';
import MoneyTypeRender from 'Controls/_grid/dirtyRender/types/MoneyRender';
import NumberTypeRender from 'Controls/_grid/dirtyRender/types/NumberRender';
import DateTypeRender from 'Controls/_grid/dirtyRender/types/DateRender';
import StringTypeRender from 'Controls/_grid/dirtyRender/types/StringRender';
import StringSearchTypeRender from 'Controls/_grid/dirtyRender/types/StringSearchRender';
import TypesLadderWrapper from 'Controls/_grid/dirtyRender/types/LadderWrapper';

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
 * @includes ItemEditorTemplate Controls/_grid/compatibleLayer/ItemEditorComponent
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
    ItemTemplate,
    getCompatibleGridRowComponentProps,
    CompatibleRowComponentPropsConverter,
    ItemEditorTemplate,
    ResultsTemplate,
    ResultColumnTemplate,
    ColumnTemplate,
    CompatibleCellComponentPropsConverter,
    getCompatibleGridCellComponentProps,
    getCompatibleCellContentRender,
    ICompatibleCellComponentPropsConverterProps,
    IColumnTemplateProps,
    IEditArrowProps,
    TypesLadderWrapper,
    GroupTemplate,
    HeaderContent,
    FooterTemplate,
    FooterColumnTemplate,
    TrackedPropertiesComponentWrapper,
    ITrackedPropertiesTemplateProps,
    EmptyTemplate,
    EmptyColumnTemplate,
    EditArrowComponent,
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
    TFooter,
    TEmptyTemplateColumns,
    CursorUtils,
} from 'Controls/gridDisplay';

export { default as SortingButton } from 'Controls/_grid/gridReact/components/SortingButtonComponent';

import {
    ColumnResizerCell,
    Indicator,
    Trigger,
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
    getRowComponentProps,
    calcRowPadding,
} from 'Controls/gridDisplay';

export { DEFAULT_GROUP_CELL_Z_INDEX, FIXED_GROUP_CELL_Z_INDEX };

// region ReactRender

export { resolveViewControls } from 'Controls/_grid/utils/ReactViewControlsResolver';

export {
    updateCollectionIfReactView,
    isGridCollection,
} from 'Controls/_grid/utils/updateCollectionfromProps';
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
    IGridItemProps,
    IItemsContainerPadding,
    GroupCellComponent,
    BaseCellComponent,
    IBaseCellComponentProps,
    getRowComponentProps,
    calcRowPadding,
    ICellContentOrientation,
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
    CheckboxCell,
    TCellsIterator,
    MoneyTypeRender,
    NumberTypeRender,
    DateTypeRender,
    StringTypeRender,
    StringSearchTypeRender,
};

export * as BackgroundClassUtils from 'Controls/_grid/cleanRender/cell/utils/Classes/BackgroundColorStyle';
export * as ColumnScrollClassUtils from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnScroll';
export * as OffsetClassUtils from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';
export * as RowSeparatorClassUtils from 'Controls/_grid/cleanRender/cell/utils/Classes/RowSeparator';
export * as ColumnSeparatorClassUtils from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnSeparator';
export * as BaseCellRenderUtils from 'Controls/_grid/cleanRender/cell/utils/BaseCell';
export * as ColumnScrollRenderUtils from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
export * as PaddingRenderUtils from 'Controls/_grid/cleanRender/cell/utils/Props/Padding';
export * as RowSeparatorUtils from 'Controls/_grid/cleanRender/cell/utils/Props/RowSeparator';
export * as ColumnSeparatorUtils from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnSeparator';
export * as CellPropsUtils from 'Controls/_grid/cleanRender/cell/utils/Props/Cell';
export * as BackgroundRenderUtils from 'Controls/_grid/cleanRender/cell/utils/Props/BackgroundColorStyle';
export * as DisplayTypeUtils from 'Controls/_grid/utils/Type';
export { default as ActionsWrapper } from 'Controls/_grid/dirtyRender/cell/components/ActionsWrapper';

//Вынесено из _gridReact
export {
    IGridProps,
    IBaseColumnConfig,
    IColspanProps,
    IRowspanProps,
    THorizontalMarginSize,
} from 'Controls/_grid/gridReact/CommonInterface';
export {
    default as GridView,
    propsAreEqual as gridViewPropsAreEqual,
    getRowComponent,
} from 'Controls/_grid/gridReact/view/View';
export {
    IGridViewProps,
    IViewTriggerProps,
    TTriggerVisibilityChangedCallback,
} from 'Controls/_grid/gridReact/view/interface';
export {
    default as CellComponent,
    getStyles as getCellComponentStyles,
} from 'Controls/_grid/dirtyRender/cell/CellComponent';
export {
    IColumnConfig,
    IHeaderConfig,
    TGetCellPropsCallback,
    ICellProps,
    ICellComponentProps,
    TColumnWidth,
    IResultConfig,
    IFooterConfig,
    IEmptyViewConfig,
    INodeFooterConfig,
    INodeHeaderConfig,
    TColumnKey,
    IHorizontalCellPadding,
    TRowSeparatorSize,
} from 'Controls/_grid/dirtyRender/cell/interface';
export { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';
export {
    IRowProps,
    TGetRowPropsCallback,
    IRowComponentProps,
    IVerticalRowPadding,
    IBeforeContentRenderProps,
} from 'Controls/_grid/gridReact/row/interface';
export { IEmptyViewProps } from 'Controls/_grid/gridReact/emptyView/interface';
export { useListData } from 'Controls/_grid/gridReact/hooks/useListData';
export { useItemData } from 'Controls/_grid/gridReact/hooks/useItemData';
export { useItemState } from 'Controls/_grid/gridReact/hooks/useItemState';
export {
    TGetGroupPropsCallback,
    IGroupComponentProps,
    IGroupRowComponentProps,
    IGroupProps,
} from 'Controls/_grid/gridReact/group/interface';
export {
    useWatchRecord,
    IRenderData,
    getRenderValues,
} from 'Controls/_grid/gridReact/hooks/useWatchRecord';
export { default as CheckboxComponent } from 'Controls/_grid/gridReact/components/CheckboxComponent';
export { default as LadderWrapper } from 'Controls/_grid/gridReact/ladder/LadderWrapper';
export { default as RowComponent } from 'Controls/_grid/gridReact/row/RowComponent';
export { getCleanCellComponent } from 'Controls/_grid/gridReact/row/clean/CleanCellComponentResolver';
export { getCompatibleCellComponent } from 'Controls/_grid/gridReact/row/compatible/CompatibleCellComponentResolver';
export { getDirtyCellComponentContentRender } from 'Controls/_grid/gridReact/row/dirty/DirtyCellComponentContentRenderResolver';
