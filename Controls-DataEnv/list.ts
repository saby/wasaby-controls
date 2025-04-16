/**
 * Библиотека, содержащая легковесный интерактор списка.
 * Подробнее о интеракторах написано в {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d документе}.
 * @library
 * @public
 * @module
 * @kaizenZone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export { ListSlice } from './newLists/_list/ListSlice';
export type { IListState } from './newLists/_list/interface/IListState';
export * as IListStateParts from './newLists/_list/interface/IListStateParts';

export type { IListDataFactory } from './newLists/_list/interface/factory/IListDataFactory';
export type { IListDataFactoryArguments } from './newLists/_list/interface/factory/IListDataFactoryArguments';
export type { IListDataFactoryLoadResult } from './newLists/_list/interface/factory/IListDataFactoryLoadResult';

export { default as loadData } from './newLists/_list/loadData';
//# region === Действия в Web списках, их типы и конструкторы ===
import { ListActionCreators, type TListActions } from './newLists/_list/actions';

export { ListActionCreators, type TListActions };
//# endregion === Действия в Web списках, их типы и конструкторы ===

//# region === middleware-функции и их типы ===
export type { TListMiddleware } from './newLists/_list/types/TListMiddleware';
export type {
    TListMiddlewareContext,
    TListMiddlewareContextGetter,
} from './newLists/_list/types/TListMiddlewareContext';

export * from './newLists/_list/middlewares/middlewaresAsync';

//# endregion  === middleware-функции и их типы ===

export { SnapshotName } from './newLists/_list/types/SnapshotName';
export type { ISnapshotsStore } from './newLists/_list/types/ISnapshotsStore';

//# region НЕ ИСПОЛЬЗОВАТЬ!

// После удаления файлов, export будет удален.
// Только для Controls/_dataFactory/ListWebDispatcher/middlewares/_search.ts
export type { ISnapshotsStore as _privateForOldCode_ISnapshotsStore } from './newLists/_list/types/ISnapshotsStore';

// Только для Controls-DataEnv/newLists/_list/actions/types/complexUpdate.ts
export type { TMiddlewaresPropsForMigrationToDispatcher as _private_TMiddlewaresPropsForMigrationToDispatcher } from './newLists/_list/actions/types/complexUpdate';
//# endregion НЕ ИСПОЛЬЗОВАТЬ!

import { getActiveElementByItems } from 'Controls-DataEnv/newLists/_list/helpers/getActiveElementByItems';
import { getFilterModuleSync } from 'Controls-DataEnv/newLists/_list/helpers/getFilterModuleSync';

import * as sourceInitializer from './newLists/_list/ListWebInitializer/source';
import * as operationPanelInitializer from './newLists/_list/ListWebInitializer/operationsPanel';

export const ListWebInitializers = {
    source: sourceInitializer,
    operationsPanel: operationPanelInitializer,
};

export const _private = {
    getFilterModuleSync,
    getActiveElementByItems,
};

export {
    LIST_CONTEXT_NODE_NAME,
    FILTER_CONTEXT_NODE_NAME,
} from './newLists/_list/getContextConfig';

export { default as factory } from './newLists/_list/factory';
