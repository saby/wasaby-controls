/**
 * Библиотека "Таблица с загружаемыми колонками"
 * @class Controls-Lists/dynamicGrid
 * @public
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
export { IDynamicHeaderCellsColspanCallback } from './_dynamicGrid/render/Header';
export {
    DynamicGridComponent,
    IDynamicGridComponentProps,
    IDynamicColumnMouseEventCallback,
    IEventMouseEventCallback,
} from './_dynamicGrid/Component';
export { NAVIGATION_LIMIT_FACTOR } from './_dynamicGrid/constants';
export { CLASS_DYNAMIC_HEADER_CELL } from './_dynamicGrid/shared/constants';
export { getColumnGapSize } from './_dynamicGrid/utils';
export {
    DynamicGridConnectedComponent,
    IDynamicGridConnectedComponentProps,
} from './_dynamicGrid/ConnectedComponent';
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
