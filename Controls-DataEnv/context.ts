/**
 * Библиотека, содержащая контекст данных.
 * @library
 * @public
 * @includes Provider Controls-DataEnv/_context/Provider
 * @includes useSlice Controls-DataEnv/_context/useSlice
 * @includes DataContext
 */
export { DataContextProvider as Provider } from './_context/Provider';
export { default as DataContext } from './_context/DataContext';
export { default as useSlice } from './_context/useSlice';
