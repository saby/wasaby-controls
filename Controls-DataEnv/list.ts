/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */

export { IListState } from './newLists/_list/interface/IListState';

export { IListDataFactory } from './newLists/_list/interface/factory/IListDataFactory';
export { IListDataFactoryArguments } from './newLists/_list/interface/factory/IListDataFactoryArguments';
export { IListDataFactoryLoadResult } from './newLists/_list/interface/factory/IListDataFactoryLoadResult';

//# region === Действия в Web списках, их типы и конструкторы ===
export {
    // Конструкторы действий в web списке.
    ListActionCreators,
    // Тип действия, доступного в web списке, объединяет все доступные действия.
    // Тип каждого действия, например TListActions.marker.TActivateMarkerAction.
    // Все действия TListActions.TAnyListAction
    type TListActions,
} from './newLists/_list/actions';
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
export { filterPanelMiddleware } from './newLists/_list/middlewaresAsync/filterPanel';
export { beforeApplyStateMiddleware } from './newLists/_list/middlewaresAsync/beforeApplyState';
//# endregion  === middleware-функции ===

export { SnapshotName } from './newLists/_list/types/SnapshotName';

//# region НЕ ИСПОЛЬЗОВАТЬ!

// После удаления файлов, export будет удален.
// Только для Controls/_dataFactory/ListWebDispatcher/middlewares/_search.ts
export { ISnapshotsStore as _privateForOldCode_ISnapshotsStore } from './newLists/_list/types/ISnapshotsStore';

// Только для Controls/_dataFactory/ListWebDispatcher/ListWebDispatcher.ts и
// tests/Controls-ListsUnit/dataFactory/ListWebDispatcher/middlewares/operationsPanel.test.ts
export { SnapshotsStore as _privateForOldCode_SnapshotsStore } from './newLists/_list/SnapshotsStore';
//# endregion НЕ ИСПОЛЬЗОВАТЬ!
