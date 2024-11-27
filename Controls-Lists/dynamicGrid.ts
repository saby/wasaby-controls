/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
/**
 * Библиотека "Таблица с загружаемыми колонками". Предоставляет компоненты, обеспечивающие навигацию по колонкам таблицы.
 * - {@link Controls-Lists/dynamicGrid:ConnectedComponent Контрол "Таблица с загружаемыми колонками"}
 * - {@link Controls-Lists/dynamicGrid:DynamicGridFactory Фабрика данных "Таблицы с загружаемыми колонками"}
 * См. также:
 * * {@link Controls-Lists/timelineGrid Библиотека "Таймлайн таблица".}
 * * {@link https://n.sbis.ru/article/e917f0a4-cb20-4c16-827d-b8723ad9ca8b Спецификация Таймлайн таблицы}
 * @library Controls-Lists/dynamicGrid
 * @public
 * @includes ConnectedComponent Controls-Lists/_dynamicGrid/ConnectedComponent
 * @includes DynamicGridFactory Controls-Lists/_dynamicGrid/factory/Factory/IDynamicGridFactory
 * @includes TCellsMultiSelectAccessibilityCallback Controls-Lists/dynamicGrid/TCellsMultiSelectAccessibilityCallback
 * @includes TCellsMultiSelectVisibility Controls-Lists/dynamicGrid/TCellsMultiSelectVisibility
 * @includes TQuantumType Controls-Lists/dynamicGrid/TQuantumType
 * @includes TColumnDataDensity Controls-Lists/dynamicGrid/TColumnDataDensity
 * @includes TSelectionMap Controls-Lists/dynamicGrid/TSelectionMap
 * @includes RenderUtils Controls-Lists/_dynamicGrid/render/utils/RenderUtils
 * @includes Component Controls-Lists/_dynamicGrid/Component
 * @includes IDynamicGridComponentProps Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps
 * @includes IDynamicCellProps Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicCellProps
 * @includes IDynamicGridConnectedComponentProps Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps
 * @demo Controls-Lists-demo/dynamicGrid/WI/Base/Index
 */

import 'css!Controls-Lists/dynamicGrid';
import 'Controls/gridReact';
import 'Controls/gridColumnScroll';
import 'Controls/columnScrollReact';

import { getColumnsEndedCallback } from './_dynamicGrid/ConnectedComponent';
import {
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
    applyLoadedColumnsData,
} from './_dynamicGrid/factory/utils';

export const Utils = {
    getColumnsEndedCallback,
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
    applyLoadedColumnsData,
};

export { useItemData, useDynamicHeaderData } from './_dynamicGrid/hooks/renderHooks';
export { getInitialColumnsScrollPosition, getPositionInPeriod } from './_dynamicGrid/render/utils';
export { TColumnDataDensity, TQuantumType } from './_dynamicGrid/shared/types';
export { datesEqualByQuantum } from './_dynamicGrid/shared/utils/datesEqualByQuantum';
export { Component, DynamicGridComponent } from './_dynamicGrid/Component';
export {
    NAVIGATION_LIMIT_FACTOR,
    AGGREGATION_COLUMN_WIDTH,
    CHECKBOX_COLUMN_WIDTH,
    DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH,
} from './_dynamicGrid/constants';
export {
    CLASS_DYNAMIC_HEADER_CELL,
    DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
    DYNAMIC_GRID_CELL_STICKIED_Z_INDEX,
    DYNAMIC_GRID_CELL_FIXED_STICKIED_Z_INDEX,
} from './_dynamicGrid/shared/constants';
export {
    getColumnGapSize,
    getViewportWidth,
    getStaticColumnsWidth,
    getDynamicColumnWidth,
} from './_dynamicGrid/utils';
export { default as ConnectedComponent } from './_dynamicGrid/ConnectedComponent';
export { default as DynamicGridFactory } from './_dynamicGrid/factory/Factory';
export {
    default as DynamicGridSlice,
    IDynamicGridSliceState,
    IDynamicSliceGenerateDynamicColumnsData,
} from './_dynamicGrid/factory/Slice';
export {
    IDynamicColumnsNavigationSourceConfig,
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsFilter,
    IDynamicColumnsNavigation,
} from './_dynamicGrid/factory/IDynamicGridDataFactoryArguments';
export { ISelection } from './_dynamicGrid/selection/SelectionContainer';
export {
    ICellsMultiSelectAccessibility,
    TCellsMultiSelectVisibility,
    TCellsMultiSelectVisibility as TMultiSelectVisibility,
    TOnBeforeSelectionChangeCallback,
    TOnSelectionChangedCallback,
    TSelectionMap,
    TCellsMultiSelectAccessibilityCallback,
} from './_dynamicGrid/selection/shared/interface';
export {
    TItemCustomClick,
    IDynamicColumnConfig,
    IDynamicHeaderConfig,
    THoverMode,
    IBaseDynamicGridComponentProps as IDynamicGridConnectedComponentProps,
    TGetDynamicCellPropsCallback,
    IDynamicGridComponentProps,
    TDynamicColumnMouseEventCallback,
    IDynamicCellProps,
} from './_dynamicGrid/interfaces/IDynamicGridComponent';
export {
    IBaseTimelineGridComponentProps,
    TGetEventRenderPropsCallback,
    ICustomEventRenderProps,
    TEventRenderViewMode,
    IEventRenderProps,
    TEventMouseEventCallback,
} from './_dynamicGrid/interfaces/IEventRenderProps';
export * as FactoryDynamicColumnsGridDataGenerator from './_dynamicGrid/factory/DynamicColumnsGridDataGenerator';
export { FactoryUtils } from './_dynamicGrid/factory/utils';
export { RenderUtils } from './_dynamicGrid/render/utils';
export { IDynamicCellRenderProps } from './_dynamicGrid/render/DynamicColumn';
export { DynamicGridColumnContext } from './_dynamicGrid/context/DynamicGridColumnContext';

import { datesEqualByQuantum } from './_dynamicGrid/shared/utils/datesEqualByQuantum';
import { prepareExtraRowColumns } from './_dynamicGrid/shared/utils/extraRowsPreparator';

export { IPrepareExtraRowColumnsParams } from './_dynamicGrid/shared/utils/extraRowsPreparator';
import {
    patchColumnProps,
    addDefaultClassNameToAllDynamicColumns,
} from './_dynamicGrid/shared/utils/patchColumnProps';

export const SharedUtils = {
    datesEqualByQuantum,
    prepareExtraRowColumns,
    patchColumnProps,
    addDefaultClassNameToAllDynamicColumns,
};
