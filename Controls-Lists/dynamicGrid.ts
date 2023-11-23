/**
 * Библиотека "Таблица с загружаемыми колонками"
 * @library Controls-Lists/dynamicGrid
 * @public
 * @includes TMultiSelectAccessibilityCallback Controls-Lists/_dynamicGrid/selection/selectionContext/gridSelectionContext/GridSelectionContext/MultiSelectAccessibilityCallback
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
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
export {
    DynamicGridComponent,
    IBaseDynamicGridComponentProps as IDynamicGridConnectedComponentProps,
    IDynamicGridComponentProps,
    TDynamicColumnMouseEventCallback,
    TEventMouseEventCallback,
} from './_dynamicGrid/Component';
export { NAVIGATION_LIMIT_FACTOR } from './_dynamicGrid/constants';
export {
    CLASS_DYNAMIC_HEADER_CELL,
    DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
} from './_dynamicGrid/shared/constants';
export { getColumnGapSize } from './_dynamicGrid/utils';
export { DynamicGridConnectedComponent } from './_dynamicGrid/ConnectedComponent';
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
} from './_dynamicGrid/factory/IDynamicGridFactory';
export {
    ISelection,
    TCellsMultiSelectVisibility,
} from './_dynamicGrid/selection/SelectionContainer';
export { IDynamicColumnConfig, THoverMode } from './_dynamicGrid/interfaces/IDynamicGridComponent';
export * as FactoryDynamicColumnsGridDataGenerator from './_dynamicGrid/factory/DynamicColumnsGridDataGenerator';
export * as FactoryUtils from './_dynamicGrid/factory/utils';
export * as RenderUtils from './_dynamicGrid/render/utils';

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
