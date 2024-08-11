import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { Logger as DispatcherLogger } from '../utils';

export const log: TListMiddlewareCreator = () => {
    return (next) => async (action) => {
        DispatcherLogger.logAction(action);
        next(action);
    };
};
