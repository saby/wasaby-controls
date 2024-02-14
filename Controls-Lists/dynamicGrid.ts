/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
/**
 * Библиотека "Таблица с загружаемыми колонками"
 * @library Controls-Lists/dynamicGrid
 * @public
 * @includes DynamicGridFactory Controls-Lists/_dynamicGrid/factory/Factory/IDynamicGridFactory
 * @includes TCellsMultiSelectAccessibilityCallback Controls-Lists/dynamicGrid/TCellsMultiSelectAccessibilityCallback
 * @includes TCellsMultiSelectVisibility Controls-Lists/dynamicGrid/TCellsMultiSelectVisibility
 * @includes TQuantumType Controls-Lists/dynamicGrid/TQuantumType
 * @includes TColumnDataDensity Controls-Lists/dynamicGrid/TColumnDataDensity
 * @includes TSelectionMap Controls-Lists/dynamicGrid/TSelectionMap
 * @includes RenderUtils Controls-Lists/_dynamicGrid/render/utils/RenderUtils
 * @includes Component Controls-Lists/_dynamicGrid/Component
 * @includes IDynamicGridComponentProps Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps
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

export { useItemData } from './_dynamicGrid/hooks/renderHooks';
export { getInitialColumnsScrollPosition, getPositionInPeriod } from './_dynamicGrid/render/utils';
export { TColumnDataDensity, TQuantumType } from './_dynamicGrid/shared/types';
export { datesEqualByQuantum } from './_dynamicGrid/shared/utils/datesEqualByQuantum';
export { Component, DynamicGridComponent } from './_dynamicGrid/Component';
export { NAVIGATION_LIMIT_FACTOR } from './_dynamicGrid/constants';
export {
    CLASS_DYNAMIC_HEADER_CELL,
    DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
} from './_dynamicGrid/shared/constants';
export { getColumnGapSize } from './_dynamicGrid/utils';
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
    THoverMode,
    IBaseDynamicGridComponentProps as IDynamicGridConnectedComponentProps,
    TGetDynamicCellPropsCallback,
    IDynamicGridComponentProps,
    TDynamicColumnMouseEventCallback,
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
export * as FactoryUtils from './_dynamicGrid/factory/utils';
export { RenderUtils } from './_dynamicGrid/render/utils';
export { IDynamicCellRenderProps } from './_dynamicGrid/render/DynamicColumn';

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
