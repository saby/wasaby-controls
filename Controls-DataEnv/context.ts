/**
 * Библиотека, содержащая контекст данных.
 * @library
 * @public
 * @module
 */
export {
    DataContextProvider as Provider,
    IDataContextOptions,
} from './_context/providers/ContextNodeProvider';
export { default as DataContext } from './_context/contexts/SliceContext';
export { STORE_ROOT_NODE_KEY } from './_context/Constants';
export {
    default as RootContextProvider,
    IDataContextOptions as IRootContextProviderOptions,
    IDataConfigs,
    TProviderRef,
} from './_context/providers/HierarchyContextNodeProvider';
export { default as RootContext, IRootContext } from './_context/contexts/HierarchySliceContext';
export { default as useSlice } from './_context/hooks/useSlice';
export { default as useData } from './_context/hooks/useData';
export { default as useStrictSlice } from './_context/hooks/useStrictSlice';
export { default as useContextNode } from './_context/hooks/useContextNode';
export { useConnectedValue, clearProps, BindingType } from './_context/hooks/useConnectedValue';
