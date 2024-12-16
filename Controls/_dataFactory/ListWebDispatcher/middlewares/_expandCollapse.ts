/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListAction } from 'Controls-DataEnv/list';
import type { TListMiddlewareCreator } from 'Controls-DataEnv/list';

export const _expandCollapse: TListMiddlewareCreator = () => {
    return (next) => async (action: TListAction) => {
        next(action);
    };
};
