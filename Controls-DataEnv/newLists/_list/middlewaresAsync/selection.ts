/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { asyncMiddlewareFactory } from 'Controls-DataEnv/dispatcher';
import { TListMiddleware } from '../types/TListMiddleware';

export const selectionMiddleware: TListMiddleware = asyncMiddlewareFactory(
    'Controls/listWebReducers:selection',
    'selection',
    ['setSelectionVisibility', 'resetSelection', 'setSelection', 'updateSelection']
);
