/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/**
 * Библиотека контролов, которые реализуют плоский список, отображающийся в виде {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицы}.
 * @library
 * @includes ItemTemplate Controls/_gridRender/interface/ItemTemplate
 * @includes ResultsTemplate Controls/_gridRender/interface/ResultsTemplate
 * @includes GroupTemplate Controls/_gridRender/Render/GroupCellComponent
 * @includes HeaderContent Controls/_gridRender/Render/HeaderCellComponent
 * @includes ColumnTemplate Controls/_gridRender/interface/ColumnTemplate
 * @includes ResultColumnTemplate Controls/_gridRender/interface/ResultColumnTemplate
 * @includes FooterTemplate Controls/_gridRender/interface/FooterTemplate
 * @includes EmptyTemplate Controls/_gridRender/interface/EmptyTemplate
 * @includes EmptyColumnTemplate Controls/_gridRender/interface/EmptyColumnTemplate
 * @includes ItemEditorTemplate Controls/_gridRender/interface/IItemEditorTemplate
 * @public
 */

import 'Controls/gridColumnScroll';

export * from 'Controls/gridRender';
export {
    ItemTemplate,
    ResultsTemplate,
    HeaderContent,
    ColumnTemplate,
    ResultColumnTemplate,
    FooterTemplate,
    EmptyTemplate,
    EmptyColumnTemplate,
    FooterColumnTemplate,
    GroupTemplate,
    SortingButton,
    LadderWrapper,
    EditArrowComponent,
    useListData,
    useItemData,
    useItemState,
    IUseListDataResult,
    IListData,
    TWatchedData,
    IItemAddOptions,
    IItemEditOptions,
    IColumnConfig,
    IFooterConfig,
    IResultConfig,
    IHeaderConfig,
    INodeHeaderConfig,
    INodeFooterConfig,
    IEmptyViewConfig,
    ICellProps,
    INodeFooterCellProps,
    IEmptyViewProps,
    IGroupProps,
    IRowProps,
    IVerticalRowPadding,
    IColumnDataDecoratorProps,
    IHorizontalCellPadding,
    IEditableGrid,
    IGridEditingConfig,
    TWidthUnits,
    TColumnWidth,
    TEditingMode,
    TAddPosition,
    TBeforeEndEditEventResult,
    TResultsPosition,
    TColumnKey,
    TGetRowPropsCallback,
    TRowSeparatorSize,
    MoneyTypeRender,
    NumberTypeRender,
    DateTypeRender,
    StringTypeRender,
    HighlightedTypeRender,
    TypesLadderWrapper,
} from 'Controls/gridRender';
export { default as View } from 'Controls/_grid/Grid';
export {
    default as ItemsView,
    IItemsGridOptions as IItemsViewOptions,
} from 'Controls/_grid/ItemsGrid';
export { GridControl, IGridControlOptions } from 'Controls/_grid/GridControl';
export {
    ITrackedPropertiesTemplateProps,
    EditorDecoratorConnected as EditorDecorator,
    IEditorDecoratorConnectedProps as IEditorDecorator,
    TrackedPropertiesComponentWrapper,
} from 'Controls/listVisualAspects';
export {
    updateCollectionIfReactView,
    isGridCollection,
} from 'Controls/_grid/utils/updateCollectionfromProps';
export { resolveViewControls } from 'Controls/_grid/utils/ReactViewControlsResolver';
export {
    getCellIndexByEventTarget,
    getCellIndexByEventTargetCommon,
    correctEventTargetFF,
    getCellElementByEventTarget,
} from 'Controls/_grid/utils/DomUtils';

export {
    GridMixin,
    TColspanCallbackResult,
    TColspanCallback,
    TResultsColspanCallback,
    IEmptyTemplateColumn,
    IGridOptions,
    THeaderVisibility,
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
    IGridAbstractColumn,
    IItemActionsCell,
    Colgroup,
    TFooter,
    TEmptyTemplateColumns,
    IDisplaySearchValueOptions,
    IDisplaySearchValue,
    CheckboxCell,
    TCellsIterator,
    ColumnResizer,
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
    ICompatibleFooterConfig,
    ICompatibleHeaderConfig,
    ICompatibleColumnConfig,
    IGridLadderProps,
    IColumnScrollGridProps,
    TColumnScrollStartPosition,
    TAutoScrollMode,
    TColumnScrollViewMode,
    HeaderVisibility,
    IEmptyTemplateOptions,
    TEmptyTemplateHeight,
    TEmptyTemplateBackgroundColorStyle,
    IGridControlCompatibleProps,
} from 'Controls/gridDisplay';
export { validateGridParts, IGridParts } from 'Controls/_grid/utils/ConfigValidation';
