/**
 * Приватная встроенная библиотека фабрики списка, содержащей операции с коллекциями.
 * @library
 * @private
 * @module
 */
import { _private as _private_list } from 'Controls-DataEnv/list';
import { getErrorConfig, processError } from './newLists/_listLoader/utils/getConfigAfterLoadError';

export { ListSlice } from 'Controls-DataEnv/list';
export type { TErrorQueryConfig as _private_TErrorQueryConfig } from './newLists/_listLoader/utils/getConfigAfterLoadError';

export { CurrentListSlice as Slice } from './newLists/_currentList/CurrentListSlice';
export { default as factory } from './newLists/_currentList/factory';
export { IListDataFactoryArguments } from './newLists/_currentList/interface/factory/IListDataFactoryArguments';
export { IListDataFactoryLoadResult } from './newLists/_currentList/interface/factory/IListDataFactoryLoadResult';
export { IListDataFactory } from './newLists/_currentList/interface/factory/IListDataFactory';
export { default as loadData } from './newLists/_currentList/loadData';
export {
    IListState,
    type TListActions,
    ListWebInitializers,
    LIST_CONTEXT_NODE_NAME,
    FILTER_CONTEXT_NODE_NAME,
    ListActionCreators,
    TListMiddleware,
    TListMiddlewareContext,
} from 'Controls-DataEnv/list';

export const _private = {
    ..._private_list,
    getErrorConfig,
    processError,
};
