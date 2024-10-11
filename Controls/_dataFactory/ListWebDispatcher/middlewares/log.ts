/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

const DEBUG_LIB = 'Controls-DataEnv/listDebug' as const;

export const log: TListMiddlewareCreator = () => {
    return (next) => async (action) => {
        if (isLoaded(DEBUG_LIB)) {
            loadSync<typeof import('Controls-DataEnv/listDebug')>(
                DEBUG_LIB
            ).DispatcherLogger.logAction(action);
        }
        next(action);
    };
};
