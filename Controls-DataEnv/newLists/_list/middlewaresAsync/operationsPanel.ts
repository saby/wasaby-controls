import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import type { IListState, TListActions, TListMiddlewareContext } from 'Controls-DataEnv/list';
import { TListMiddleware } from '../types/TListMiddleware';

export const operationsPanelMiddleware: TListMiddleware = asyncMiddlewareFactory<
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
