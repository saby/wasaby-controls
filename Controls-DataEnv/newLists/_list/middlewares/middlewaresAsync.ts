import type { TListMiddleware } from '../types/TListMiddleware';
import type { TAbstractListMiddleware } from 'Controls-DataEnv/abstractList';
import type { TListMiddlewareContext } from '../types/TListMiddlewareContext';
import type { IListState } from '../interface/IListState';
import type { TListActions } from '../actions';
import { isEqual } from 'Types/object';
import { getSourceControllerOptions } from '../ListWebInitializer/source';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

import * as DispatcherLib from 'Controls-DataEnv/dispatcher';
const { asyncMiddlewareFactory } = DispatcherLib;
const getMiddlewarePath = (name: string) => LibPaths.ListWebReducers + ':' + name;
/**
 * Промежуточная функция(middleware) обработки действий над хлебными крошками.
 * @private
 */
export const breadCrumbsMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('breadCrumbs'),
    ['setBreadCrumbs', 'handleItemsChanged']
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с окнами фильтров.
 * @private
 */
export const errorMiddleware: TListMiddleware = asyncMiddlewareFactory(getMiddlewarePath('error'), [
    'handleLoadError',
]);

/**
 * Промежуточная функция(middleware) обработки действий над разворотом узлов.
 * @private
 */
export const expandCollapseMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('expandCollapse'),
    [
        'setExpandedItems',
        'setCollapsedItems',
        'updateExpansionModel',
        'setExpandCollapsedItems',
        'expand',
        'expandParent',
        'collapse',
        'resetExpansion',
        'onItemsRemoved',
    ]
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с фильтрацией данных.
 * @private
 */
export const filterMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('filter'),
    ['setFilterDescription', 'setFilter']
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с окнами фильтров.
 * @private
 */
export const filterPanelMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('filterPanel'),
    ['openFilterDetailPanel', 'closeFilterDetailPanel']
);

/**
 * Промежуточная функция(middleware) обработки действий над подсветкой полей.
 * @private
 */
export const highlightFieldsMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('highlightFields'),
    ['setHighlightedFieldsMap']
);

/**
 * Промежуточная функция(middleware) обработки действий над действиями записей.
 * @private
 */
export const itemActionsMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('itemActions'),
    [
        'updateItemActionsMap',
        'onItemsRemoved',
        'onAllItemsReplaced',
        'onItemsAdded',
        'onItemsReset',
        'onItemsReplaced',
    ]
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с работой с сырым набором записей (RecordSet).
 * @private
 */
export const itemsMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('items'),
    [
        'replaceAllItems',
        'removeItems',
        'replaceItems',
        'prependItems',
        'appendItems',
        'changeKeyProperty',
        'replaceMetaData',
        'mergeMetaData',
        'setItemsChanges',
        'resetItems',
    ]
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с отметкой записей маркером.
 * @private
 */
export const markerMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('marker'),
    [
        'setMarkerVisibility',
        'activateMarker',
        'setMarkedKey',
        'mark',
        'markNearbyItem',
        'onItemsRemoved',
        'onItemsAdded',
        'onAllItemsReplaced',
        'onItemsReset',
        'markNext',
    ]
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с ПМО.
 * @private
 */
export const operationsPanelMiddleware: TListMiddleware = asyncMiddlewareFactory<
    IListState,
    TListActions.TAnyListAction,
    TListMiddlewareContext
>(getMiddlewarePath('operationsPanel'), [
    'openOperationsPanel',
    'closeOperationsPanel',
    'updateOperationsSelection',
    'setSelectionViewMode',
    'resetSelectionViewMode',
    'onItemsRemoved',
    'setListCommandsSelection',
]);

/**
 * Промежуточная функция(middleware) обработки действий над корнем иерархии.
 * @private
 */
export const rootMiddleware: TListMiddleware = asyncMiddlewareFactory(getMiddlewarePath('root'), [
    'setRoot',
    'changeRoot',
]);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с поиском.
 * @private
 */
export const searchMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('search'),
    ['resetSearch', 'awaitAllRequests']
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с множественным выделением записей.
 * @private
 */
export const selectionMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('selection'),
    [
        'setSelectionVisibility',
        'resetSelection',
        'setSelection',
        'select',
        'setSelectionModel',
        'selectAll',
        'invertSelection',
        'onItemsRemoved',
        'onItemsAdded',
        'onItemsReset',
        'updateCounter',
        'setSelectionCount',
    ]
);

/**
 * Промежуточная функция(middleware) обработки действий, связанных с работой с источником данных.
 * @private
 */
export const sourceMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('source'),
    [
        'updateSavedSourceState',
        'setSavedSourceState',
        'reload',
        'load',
        'loadOnSourceController',
        'reloadOnSourceController',
        'newItemsReceived',
        'resolveStateAfterUpdateItems',
        'loadNodes',
        'oldSliceLoad',
        'reloadItem',
        'reloadItems',
        'loadToDirection',
        'setPreloadedItems',
        'dataLoadedSuccess',
        'requestFetch',
        'fetch',
        'initSource',
        'awaitAllRequests',
        'rejectLoad',
        'updateHasMoreStorage',
        'loadPrev',
        'loadNext',
        'onEndUpdate',
    ],
    ({ getState }, action) => {
        const { sourceController } = getState();
        if (!sourceController) {
            return false;
        }

        if (action.type === 'loadPrev') {
            return sourceController.hasMoreData('up');
        }
        if (action.type === 'loadNext') {
            return sourceController.hasMoreData('down');
        }
        if (action.type === 'onEndUpdate') {
            const { prevState, nextState } = action.payload;
            const expandedItemsChanged = !isEqual(nextState.expandedItems, prevState.expandedItems);
            const countChanged = nextState.count !== prevState.count;
            return expandedItemsChanged || countChanged;
        }
    }
);
const oldBasDeps: (keyof IListState)[] = [
    'selectionViewMode',
    'viewMode',
    'collapsedItems',
    'count',
    'sourceController',
    'searchValue',
    'filterDescription',
    'rootHistoryId',
    'items',
    'listConfigStoreId',
];
export const complexUpdateMiddleware: TListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('complexUpdate'),
    ['oldBeforeApplyState'],
    ({ getTrashBox }, action) => {
        if (action.type === 'oldBeforeApplyState') {
            const { prevState, nextState } = action.payload;
            const { _propsForMigrationToDispatcher: props } = getTrashBox();
            const isComposite: boolean = nextState.viewMode === 'composite';
            const needReloadBySourceController: boolean = (
                Object.keys(getSourceControllerOptions(nextState)) as (keyof IListState)[]
            ).some((prop) => prevState[prop] !== nextState[prop]);
            const hasNewPreloadedItems: boolean = !!props?.sliceProperties?.newItems;
            const isDependencyPropChanged = oldBasDeps.some(
                (dep) => prevState[dep] !== nextState[dep]
            );

            return (
                isComposite ||
                needReloadBySourceController ||
                hasNewPreloadedItems ||
                isDependencyPropChanged
            );
        }
    }
);

/**
 * Промежуточная функция(middleware) обработки действий над заглушкой.
 * @private
 */
export const stubMiddleware: TAbstractListMiddleware = asyncMiddlewareFactory(
    getMiddlewarePath('stub'),
    ['setStubVisibility', 'onItemsAdded', 'onItemsRemoved', 'onItemsReset']
);
