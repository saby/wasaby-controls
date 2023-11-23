/**
 * Библиотека, содержащая контекст данных.
 * @library
 * @public
 * @includes Provider Controls-DataEnv/_context/Provider
 * @includes useSlice Controls-DataEnv/_context/useSlice
 * @includes DataContext
 */
export { DataContextProvider as Provider } from './_context/DataContext/Provider';
export { default as DataContext } from './_context/DataContext/DataContext';
export { default as RootContextProvider, IDataConfigs } from './_context/RootContext/Provider';
export { default as RootContext, IRootContext } from './_context/RootContext/RootContext';
export { default as useSlice } from './_context/useSlice';
