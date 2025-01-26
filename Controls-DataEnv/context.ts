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
export { default as useSliceOld } from './_context/hooks/useSliceOld';
export { default as useStrictSlice } from './_context/hooks/useStrictSlice';
export { default as useContextNode } from './_context/hooks/useContextNode';
export { useFormReadonly } from './_context/hooks/useReadonly';
export { useConnectedValue, clearProps, BindingType } from './_context/hooks/useConnectedValue';
export { IStore } from './_context/store/Store';

export {
    default as DataContextProxy,
    useDataContextProxyValue,
    IDataContextProxyValues,
} from './_context/DataContextProxy';
export { default as useSelector } from './_context/hooks/useSelector';
export { default as useSliceActions } from './_context/hooks/useSliceActions';

export { default as DataContextAPI, IDataContextAPI } from './_context/DataContext';
export { default as useStrictSliceActions } from './_context/hooks/useStrictSliceActions';
