/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Библиотека, содержащая фабрику данных списка.
 * @library
 * @public
 */

import { IBaseDataFactoryArguments, IDataFactory } from './_dataFactory/interface/IDataFactory';
import { IDataConfig } from './_dataFactory/interface/IDataConfig';
import {
    ICustomDataFactory,
    ICustomDataFactoryArguments,
} from './_dataFactory/interface/ICustomDataFactory';
import {
    IAreaDataFactory,
    IAreaDataFactoryArguments,
    IAreaDataFactoryResult,
} from './_dataFactory/interface/IAreaDataFactory';
import {
    IListDataFactory,
    IListDataFactoryLoadResult,
} from './_dataFactory/interface/IListDataFactory';

export { default as CompatibleList } from './_dataFactory/CompatibleList';
export { default as Custom } from './_dataFactory/Custom';
export { default as Area } from './_dataFactory/Area';
export { default as PropertyGrid } from './_dataFactory/PropertyGrid';
import { IListState, _private, type TListActions } from 'Controls-DataEnv/currentList';

export { IListState };

export {
    Slice as ListSlice,
    factory as List,
    IListDataFactoryArguments,
    ListWebInitializers,
    LIST_CONTEXT_NODE_NAME,
    FILTER_CONTEXT_NODE_NAME,
    ListActionCreators as ListWebActions,
    TListMiddleware,
    TListMiddlewareContext,
    _private_TErrorQueryConfig as TErrorQueryConfig,
} from 'Controls-DataEnv/currentList';
export { IListLoadResult } from './_dataFactory/interface/IListLoadResult';
export {
    IBaseDataFactoryArguments,
    IDataFactory,
    ICustomDataFactory,
    IDataConfig,
    ICustomDataFactoryArguments,
    IAreaDataFactoryArguments,
    IAreaDataFactory,
    IAreaDataFactoryResult,
    IListDataFactoryLoadResult,
    IListDataFactory,
};

export {
    ISliceWithSelection,
    isSliceWithSelection,
} from './_dataFactory/interface/ISliceWithSelection';

export type TListAction<TState extends IListState = IListState> =
    TListActions.TAnyListAction<TState>;

import { _private_DecomposedPromise } from 'Controls-DataEnv/abstractList';

const getDecomposedPromise = _private_DecomposedPromise.getDecomposedPromise;
const getErrorConfig = _private.getErrorConfig;
const processError = _private.processError;

export { getDecomposedPromise, getErrorConfig, processError, _private };

export { resolveCollectionType } from 'Controls-DataEnv/abstractList';
