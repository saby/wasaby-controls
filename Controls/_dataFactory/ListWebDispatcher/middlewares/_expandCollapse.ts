/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListAction } from '../types/TListAction';
import { TListMiddlewareCreator } from '../types/TListMiddleware';

export const _expandCollapse: TListMiddlewareCreator = () => {
    return (next) => async (action: TListAction) => {
        next(action);
    };
};
