/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Библиотека, содержащая фабрику данных списка.
 * @library
 * @public
 * @includes List Controls/_dataFactory/List/_interface/IListDataFactory
 * @includes IListState Controls/_dataFactory/List/_interface/IListState
 * @includes IListLoadResult Controls/_dataFactory/List/_interface/IListLoadResult
 * @includes IListDataFactoryArguments Controls/_dataFactory/List/_interface/IListDataFactoryArguments
 * @includes AbstractListSlice Controls/_dataFactory/AbstractList/AbstractListSlice
 * @includes ListSlice Controls/_dataFactory/List/Slice
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
} from './_dataFactory/List/_interface/IListDataFactory';

export { default as List } from './_dataFactory/List';
export { default as CompatibleList } from './_dataFactory/CompatibleList';
export { default as Custom } from './_dataFactory/Custom';
export { default as Area } from './_dataFactory/Area';
export { default as PropertyGrid } from './_dataFactory/PropertyGrid';
export {
    IListState,
    IErrorConfig as IListSliceErrorConfig,
} from './_dataFactory/List/_interface/IListState';
export { IListDataFactoryArguments } from './_dataFactory/List/_interface/IListDataFactoryArguments';
export { IListLoadResult } from './_dataFactory/List/_interface/IListLoadResult';
export { default as ListSlice } from './_dataFactory/List/Slice';
export {
    getErrorConfig,
    processError,
    TErrorQueryConfig,
} from './_dataFactory/List/resources/error';
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

export { IListAspects } from './_dataFactory/AbstractList/_interface/IAspectTypes';
export { TCollectionType } from './_dataFactory/AbstractList/_interface/IAbstractListSliceTypes';
export { AbstractListSlice } from './_dataFactory/AbstractList/AbstractListSlice';
export {
    abstractLoadData,
    IAbstractLoadDataResult,
} from './_dataFactory/AbstractList/abstractLoadData';
export { IAbstractListSliceState } from './_dataFactory/AbstractList/_interface/IAbstractListSliceState';

// Вынести
export { listActions } from './_dataFactory/AbstractList/listActions';
export { AspectsNames } from './_dataFactory/AbstractList/_interface/AspectsNames';
export { default as resolveCollectionType } from './_dataFactory/AbstractList/collections/resolveCollectionType';
export { loadAspects } from './_dataFactory/AbstractList/aspectsFactory';

import type { TListActions } from 'Controls-DataEnv/list';
export type TListAction = TListActions.TAnyListAction;

export {
    ListActionCreators as ListWebActions,
    TListMiddleware,
    TListMiddlewareContext,
} from 'Controls-DataEnv/list';

import { resolveSearchViewMode } from './_dataFactory/List/utils';
import getStateAfterLoadError from './_dataFactory/List/resources/error';
import {
    getListCommandsSelection,
    getSelectionViewMode,
    getCountConfig,
    loadCount,
    getStateForOnlySelectedItems,
} from './_dataFactory/ListWebDispatcher/middlewares/operationsPanel';
import {
    isViewModeLoaded,
    loadViewModeFn,
} from './_dataFactory/ListWebDispatcher/middlewares/_loadViewMode';

import {
    search as _privateSearch,
    resetSearch,
    getStateOnSearchReset,
} from './_dataFactory/ListWebDispatcher/middlewares/_search';
import { getActiveElementByItems } from './_dataFactory/ListWebDispatcher/middlewares/_navigation';
import { processMarkedKey } from './_dataFactory/ListWebDispatcher/middlewares/marker';

export { getDecomposedPromise } from 'Controls/_dataFactory/helpers/DecomposedPromise';

import * as sourceInitializer from 'Controls/_dataFactory/ListWebInitializer/source';

export const ListWebInitializers = {
    source: sourceInitializer,
};

export const _private = {
    resolveSearchViewMode,

    getActiveElementByItems,
    processMarkedKey,
    getStateAfterLoadError,
    getListCommandsSelection,
    getSelectionViewMode,
    getCountConfig,
    loadCount,
    getStateForOnlySelectedItems,
    isViewModeLoaded,
    loadViewModeFn,
    search: _privateSearch,
    resetSearch,
    getStateOnSearchReset,
};
