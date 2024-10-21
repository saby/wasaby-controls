import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import type { IListState, TListActions, TListMiddlewareContext } from 'Controls-DataEnv/list';

export const operationsPanelMiddleware = asyncMiddlewareFactory<
    IListState,
    TListActions.TAnyListAction,
    TListMiddlewareContext
>('Controls/listWebReducers:operationsPanel', 'operationsPanel', [
    'openOperationsPanel',
    'closeOperationsPanel',
    'updateOperationsSelection',
    'setSelectionViewMode',
    'resetSelectionViewMode',
    'complexUpdateOperationsPanel',
]);
