/**
 * Библиотека, содержащая контекст данных.
 * @library
 * @public
 * @includes Provider Controls-DataEnv/_context/Provider
 * @includes useSlice Controls-DataEnv/_context/useSlice
 * @includes DataContext
 */
export { DataContextProvider as Provider } from './_context/FlatSliceContext/Provider';
export { default as DataContext } from './_context/FlatSliceContext/SliceContext';
export { STORE_ROOT_NODE_KEY } from './_context/Constants';
export {
    default as RootContextProvider,
    IDataConfigs,
} from './_context/HierarchySliceContext/Provider';
export {
    default as RootContext,
    IRootContext,
} from './_context/HierarchySliceContext/HierarchySliceContext';
export { default as useSlice } from './_context/useSlice';
export { default as useStrictSlice } from './_context/useStrictSlice';
export { default as useContextNode } from './_context/useContextNode';
export { useConnectedValue, clearProps, type BindingType } from './_context/useConnectedValue';
