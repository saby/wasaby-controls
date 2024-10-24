import { TListAction } from '../types/TListAction';
import { TListMiddlewareCreator } from '../types/TListMiddleware';

export const _expandCollapse: TListMiddlewareCreator = () => {
    return (next) => async (action: TListAction) => {
        next(action);
    };
};
