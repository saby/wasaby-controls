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
} from './_dynamicGrid/factory/utils';

export const Utils = {
    getColumnsEndedCallback,
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
};

export { useRenderData } from './_dynamicGrid/hooks/renderHooks';
export { DynamicGridComponent, IDynamicGridComponentProps } from './_dynamicGrid/Component';
export { NAVIGATION_LIMIT_FACTOR } from './_dynamicGrid/constants';
export {
    DynamicGridConnectedComponent,
    IDynamicGridConnectedComponentProps,
} from './_dynamicGrid/ConnectedComponent';
export { default as DynamicGridFactory } from './_dynamicGrid/factory/Factory';
export { default as DynamicGridSlice, IDynamicGridSliceState } from './_dynamicGrid/factory/Slice';
export {
    IDynamicColumnsNavigationSourceConfig,
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsFilter,
    IDynamicColumnsNavigation,
} from './_dynamicGrid/factory/IDynamicGridFactory';
