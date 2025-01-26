/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import 'Controls/gridColumnScroll';

import {
    CompatibleGridRowComponent as ItemTemplate,
    getCompatibleGridRowComponentProps,
    CompatibleRowComponentPropsConverter,
} from 'Controls/_gridRender/cL/row/Data';
import {
    ICompatibleRowComponentProps as IGridItemProps,
    IItemsContainerPadding,
} from 'Controls/_gridRender/cL/row/interface';
import {
    CompatibleGridCellComponent as ColumnTemplate,
    CCCPC,
    getCompatibleCellProps,
    getCompatibleCellContentRender,
    CompatibleGridCellComponent as ItemEditorTemplate,
} from 'Controls/_gridRender/cL/cell/Data';
import {
    ICompatibleCellComponentProps as IColumnTemplateProps,
    ICCCPCProps,
} from 'Controls/_gridRender/cL/cell/interface';
import {
    EditArrowComponent,
    IEditArrowProps,
    EDIT_ARROW_SELECTOR,
    IndicatorComponent,
} from 'Controls/listsCommonLogic';

import { CompatibleGridGroupCellComponent as GroupTemplate } from 'Controls/_gridRender/cL/cell/Group';
import {
    default as GroupCellComponent,
    getWrapperRenderClassName as getGroupCellComponentWrapperRenderClassName,
    IGroupCellComponentProps,
} from 'Controls/_gridRender/cell/Group';
import {
    default as BaseCellComponent,
    IBaseCellComponentProps,
} from 'Controls/_gridRender/cell/Base';
import { CompatibleHeaderCellComponent as HeaderContent } from 'Controls/_gridRender/cL/cell/Header';
import { CompatibleResultsCellComponent as ResultColumnTemplate } from 'Controls/_gridRender/cL/cell/Results';
import { CompatibleResultsCellComponent as ResultsTemplate } from 'Controls/_gridRender/cL/cell/Results';
import { CompatibleFooterCellComponent as FooterColumnTemplate } from 'Controls/_gridRender/cL/cell/Footer';
import { CompatibleFooterCellComponent as FooterTemplate } from 'Controls/_gridRender/cL/cell/Footer';
import {
    CompatibleEmptyCellComponent as EmptyTemplate,
    CompatibleEmptyCellComponent as EmptyColumnTemplate,
} from 'Controls/_gridRender/cL/cell/Empty';

import MoneyTypeRender from 'Controls/_gridRender/cell/content/Money';
import NumberTypeRender from 'Controls/_gridRender/cell/content/Number';
import DateTypeRender from 'Controls/_gridRender/cell/content/Date';
import StringTypeRender from 'Controls/_gridRender/cell/content/String';
import { Highlighted as HighlightedTypeRender } from 'Controls/_gridRender/cell/content/Highlighted';
import TypesLadderWrapper from 'Controls/_gridRender/cell/content/Ladder';

/**
 * Библиотека контролов, которые реализуют плоский список, отображающийся в виде {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицы}.
 * @library
 * @includes ItemTemplate Controls/_gridRender/interface/ItemTemplate
 * @includes ResultsTemplate Controls/_gridRender/interface/ResultsTemplate
 * @includes GroupTemplate Controls/_gridRender/Render/GroupCellComponent
 * @includes HeaderContent Controls/_gridRender/Render/HeaderCellComponent
 * @includes ColumnTemplate Controls/_gridRender/interface/ColumnTemplate
 * @includes ResultColumnTemplate Controls/_gridRender/interface/ResultColumnTemplate
 * @includes EditingEmptyTemplate Controls/_gridRender/interface/EditingEmptyTemplate
 * @includes FooterTemplate Controls/_gridRender/interface/FooterTemplate
 * @includes EmptyTemplate Controls/_gridRender/interface/EmptyTemplate
 * @includes EmptyColumnTemplate Controls/_gridRender/interface/EmptyColumnTemplate
 * @includes RowEditor Controls/_gridRender/interface/RowEditor
 * @includes IPropStorage Controls/_gridRender/interface/IPropStorage
 * @includes SortingButton Controls/_gridRender/SortingButtonComponent
 * @includes ItemEditorTemplate Controls/_gridRender/cL/ItemEditorComponent
 * @includes IEditableGrid Controls/_gridRender/interface/IEditableGrid
 * @includes IGridEditingConfig Controls/_gridRender/interface/IGridEditingConfig
 * @includes IItemAddOptions Controls/_gridRender/interface/IItemAddOptions
 * @includes IItemEditOptions Controls/_gridRender/interface/IItemEditOptions
 * @public
 */

export {
    ItemTemplate,
    getCompatibleGridRowComponentProps,
    CompatibleRowComponentPropsConverter,
    ItemEditorTemplate,
    ResultsTemplate,
    ResultColumnTemplate,
    ColumnTemplate,
    CCCPC,
    getCompatibleCellProps,
    getCompatibleCellContentRender,
    ICCCPCProps,
    IColumnTemplateProps,
    IEditArrowProps,
    TypesLadderWrapper,
    GroupTemplate,
    IGroupCellComponentProps,
    getGroupCellComponentWrapperRenderClassName,
    HeaderContent,
    FooterTemplate,
    FooterColumnTemplate,
    EmptyTemplate,
    EmptyColumnTemplate,
    EditArrowComponent,
    EDIT_ARROW_SELECTOR,
    IndicatorComponent,
};

export * from 'Controls/_gridRender/interface/IEditableGrid';

export { default as SortingButton } from 'Controls/_gridRender/components/SortButton';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GridLoader = require('Controls/Utils/GridLoader');

export { GridLoader };

export {
    IGridItemProps,
    IItemsContainerPadding,
    GroupCellComponent,
    BaseCellComponent,
    IBaseCellComponentProps,
    MoneyTypeRender,
    NumberTypeRender,
    DateTypeRender,
    StringTypeRender,
    HighlightedTypeRender,
};

export * as AlignClassUtils from 'Controls/_gridRender/cell/utils/Classes/Align';
export * as BackgroundClassUtils from 'Controls/_gridRender/cell/utils/Classes/BackgroundColorStyle';
export * as ColumnScrollClassUtils from 'Controls/_gridRender/cell/utils/Classes/ColumnScroll';
export * as OffsetClassUtils from 'Controls/_gridRender/cell/utils/Classes/Offset';
export * as RowSeparatorClassUtils from 'Controls/_gridRender/cell/utils/Classes/RowSeparator';
export * as ColumnSeparatorClassUtils from 'Controls/_gridRender/cell/utils/Classes/ColumnSeparator';
export * as CellPositionClassUtils from 'Controls/_gridRender/cell/utils/Classes/CellPosition';
export * as BaseCellRenderUtils from 'Controls/_gridRender/cell/utils/Base';
export * as ColumnScrollRenderUtils from 'Controls/_gridRender/cell/utils/Props/ColumnScroll';
export * as PaddingRenderUtils from 'Controls/_gridRender/cell/utils/Props/Padding';
export * as RowSeparatorUtils from 'Controls/_gridRender/cell/utils/Props/RowSeparator';
export * as ColumnSeparatorUtils from 'Controls/_gridRender/cell/utils/Props/ColumnSeparator';
export * as CellPropsUtils from 'Controls/_gridRender/cell/utils/Props/Cell';
export * as BackgroundRenderUtils from 'Controls/_gridRender/cell/utils/Props/BackgroundColorStyle';
export * as StickyPropsUtils from 'Controls/_gridRender/cell/utils/Props/Sticky';
export * as DisplayTypeUtils from 'Controls/_gridRender/utils/Type';
export { default as ActionsWrapper } from 'Controls/_gridRender/components/Actions';

export { getGroupRowComponentClassName } from 'Controls/_gridRender/row/utils/Group';
export { getGroupContentTextStylingClasses } from 'Controls/_gridRender/cell/content/Group';

//Вынесено из _gridReact
export {
    IGridProps,
    IBaseColumnConfig,
    IColspanProps,
    IRowspanProps,
    THorizontalMarginSize,
} from 'Controls/_gridRender/interface/CommonInterface';
export {
    default as GridView,
    propsAreEqual as gridViewPropsAreEqual,
    getRowComponent,
} from 'Controls/_gridRender/View';
export {
    IGridViewProps,
    IViewTriggerProps,
    TTriggerVisibilityChangedCallback,
} from 'Controls/_gridRender/interface/IView';
export { default as CellComponent } from 'Controls/_gridRender/cell/Data';
export { IDataCellComponentProps as ICellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';
export {
    IColumnConfig,
    IHeaderConfig,
    TGetCellPropsCallback,
    ICellProps,
    TColumnWidth,
    IResultConfig,
    IFooterConfig,
    IEmptyViewConfig,
    INodeFooterConfig,
    INodeHeaderConfig,
    TColumnKey,
    IHorizontalCellPadding,
    TRowSeparatorSize,
} from 'Controls/_gridRender/cell/interface/ICell';
export { templateLoader } from 'Controls/_gridRender/utils/templateLoader';
export {
    IRowProps,
    TGetRowPropsCallback,
    IRowComponentProps,
    IVerticalRowPadding,
    IBeforeContentRenderProps,
} from 'Controls/_gridRender/row/interface/IRowComponent';
export { IEmptyViewProps } from 'Controls/_gridRender/row/interface/IEmpty';
export { useListData } from 'Controls/_gridRender/hooks/useListData';
export { useItemData } from 'Controls/_gridRender/hooks/useItemData';
export { useItemState, useObservableItemStates } from 'Controls/_gridRender/hooks/useItemState';
export {
    TGetGroupPropsCallback,
    IGroupComponentProps,
    IGroupRowComponentProps,
    IGroupProps,
} from 'Controls/_gridRender/interface/Group';
export {
    useWatchRecord,
    IRenderData,
    getRenderValues,
} from 'Controls/_gridRender/hooks/useWatchRecord';
export { default as CheckboxComponent } from 'Controls/_gridRender/components/Checkbox';
export { default as LadderWrapper } from 'Controls/_gridRender/ladder/Wrapper';
export { default as RowComponent } from 'Controls/_gridRender/row/Base';
export { getCleanCellComponent } from 'Controls/_gridRender/row/utils/Resolvers/Cell';
export { getCompatibleCellComponent } from 'Controls/_gridRender/cL/row/resolvers/Cell';
export { getDirtyCellComponentContentRender } from 'Controls/_gridRender/row/dirty/Resolvers/Cell';
export { default as EditRowWrapper } from 'Controls/_gridRender/row/Editing';
