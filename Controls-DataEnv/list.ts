/**
 * Библиотека, содержащая интерактор списка.
 * Подробнее о интеракторах написано в {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d документе}.
 * @library
 * @public
 * @module
 * @KaizenZone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export { ListSlice } from './newLists/_list/ListSlice';
export { IListState } from './newLists/_list/interface/IListState';
export * as IListStateParts from './newLists/_list/interface/IListStateParts';

export { IListDataFactory } from './newLists/_list/interface/factory/IListDataFactory';
export { IListDataFactoryArguments } from './newLists/_list/interface/factory/IListDataFactoryArguments';
export { IListDataFactoryLoadResult } from './newLists/_list/interface/factory/IListDataFactoryLoadResult';

export { default as loadData } from './newLists/_list/loadData';

//# region === Действия в Web списках, их типы и конструкторы ===
export { ListActionCreators, type TListActions } from './newLists/_list/actions';
//# endregion === Действия в Web списках, их типы и конструкторы ===

//# region === middleware-функции и их типы ===
export { TListMiddleware } from './newLists/_list/types/TListMiddleware';
export {
    TListMiddlewareContext,
    TListMiddlewareContextGetter,
} from './newLists/_list/types/TListMiddlewareContext';

export { rootMiddleware } from './newLists/_list/middlewaresAsync/root';
export { operationsPanelMiddleware } from './newLists/_list/middlewaresAsync/operationsPanel';
export { filterMiddleware } from './newLists/_list/middlewaresAsync/filter';
export { sourceMiddleware } from './newLists/_list/middlewaresAsync/source';
export { selectionMiddleware } from './newLists/_list/middlewaresAsync/selection';
export { searchMiddleware } from './newLists/_list/middlewaresAsync/search';
export { itemsMiddleware } from './newLists/_list/middlewaresAsync/items';
export { markerMiddleware } from './newLists/_list/middlewaresAsync/marker';
export { breadCrumbsMiddleware } from './newLists/_list/middlewaresAsync/breadCrumbs';
export { filterPanelMiddleware } from './newLists/_list/middlewaresAsync/filterPanel';
export { expandCollapseMiddleware } from './newLists/_list/middlewaresAsync/expandCollapseMiddleware';
export { itemActionsMiddleware } from './newLists/_list/middlewaresAsync/itemActions';
export { highlightFieldsMiddleware } from './newLists/_list/middlewaresAsync/highlightFields';
export { stubMiddleware } from './newLists/_list/middlewaresAsync/stub';
export { errorMiddleware } from './newLists/_list/middlewaresAsync/error';
//# endregion  === middleware-функции и их типы ===

export { SnapshotName } from './newLists/_list/types/SnapshotName';
export { ISnapshotsStore } from './newLists/_list/types/ISnapshotsStore';

//# region НЕ ИСПОЛЬЗОВАТЬ!

// После удаления файлов, export будет удален.
// Только для Controls/_dataFactory/ListWebDispatcher/middlewares/_search.ts
export { ISnapshotsStore as _privateForOldCode_ISnapshotsStore } from './newLists/_list/types/ISnapshotsStore';

// Только для Controls-DataEnv/newLists/_list/actions/types/complexUpdate.ts
export { TMiddlewaresPropsForMigrationToDispatcher as _private_TMiddlewaresPropsForMigrationToDispatcher } from './newLists/_list/actions/types/complexUpdate';
//# endregion НЕ ИСПОЛЬЗОВАТЬ!

import { resolveSearchViewMode } from './newLists/_list/loadData/resolveSearchViewMode';
import { getActiveElementByItems } from './newLists/_list/loadData/getActiveElementByItems';
import {
    getCountConfig,
    getListCommandsSelection,
    getSelectionViewMode,
    getStateForOnlySelectedItems,
    getStateOnSearchReset,
    loadCount,
} from './newLists/_list/middlewares/operationsPanel';
import { resetSearch } from './newLists/_abstractList/actions/creators/search';
import { getErrorConfig, processError } from './newLists/_list/loadData/getConfigAfterLoadError';
import { getStateAfterLoadError } from './newLists/_list/loadData/getStateAfterLoadError';

import * as sourceInitializer from './newLists/_list/ListWebInitializer/source';

export const ListWebInitializers = {
    source: sourceInitializer,
};

export { TErrorQueryConfig as _private_TErrorQueryConfig } from './newLists/_list/loadData/getConfigAfterLoadError';

export const _private = {
    resolveSearchViewMode,
    getActiveElementByItems,
    getListCommandsSelection,
    getSelectionViewMode,
    getCountConfig,
    loadCount,
    getStateForOnlySelectedItems,
    resetSearch,
    getStateOnSearchReset,
    getStateAfterLoadError,
    getErrorConfig,
    processError,
};

export {
    LIST_CONTEXT_NODE_NAME,
    FILTER_CONTEXT_NODE_NAME,
} from './newLists/_list/getContextConfig';

export { default as factory } from './newLists/_list/factory';
