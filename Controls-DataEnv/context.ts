/**
 * Библиотека, содержащая контекст данных.
 * @library
 * @public
 * @module
 */
export {
    DataContextProvider as Provider,
    IDataContextOptions,
} from './_context/FlatSliceContext/Provider';
export { default as DataContext } from './_context/FlatSliceContext/SliceContext';
export { STORE_ROOT_NODE_KEY } from './_context/Constants';
export {
    default as RootContextProvider,
    IDataContextOptions as IRootContextProviderOptions,
    IDataConfigs,
    TProviderRef,
} from './_context/HierarchySliceContext/Provider';
export {
    default as RootContext,
    IRootContext,
} from './_context/HierarchySliceContext/HierarchySliceContext';
export { default as useSlice } from './_context/useSlice';
export { default as useData } from './_context/useData';
export { default as useStrictSlice } from './_context/useStrictSlice';
export { default as useContextNode } from './_context/useContextNode';
export { useConnectedValue, clearProps, BindingType } from './_context/useConnectedValue';
