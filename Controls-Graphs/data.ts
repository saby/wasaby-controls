/**
 * @includes IStoreId Controls-Graphs/_base/interfaces/ILegend
 * @includes IName Controls-Graphs/_base/interfaces/IAnimation
 * @includes IHasDataCallback Controls-Graphs/_base/interfaces/IData
 * @includes IConnectedGraphProps Controls-Graphs/_base/interfaces/IValueFormatter
 * @library
 * @public
 */
export { default as Factory } from 'Controls-Graphs/_data/Factory';
export { default as GraphsSlice } from 'Controls-Graphs/_data/Slice';
export { useDataFromSlice } from './_data/hooks/useDataFromSlice';
export { IStoreId } from './_data/interfaces/IStoreId';
export { IName } from './_data/interfaces/IName';
export { IHasDataCallback } from './_data/interfaces/IHasDataCallback';
export { IConnectedGraphProps } from './_data/interfaces/IConnectedGraphProps';
