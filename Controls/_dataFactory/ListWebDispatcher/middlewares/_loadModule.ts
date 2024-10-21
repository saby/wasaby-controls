/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMiddlewareCreator } from 'Controls-DataEnv/list';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

export const _loadModule: TListMiddlewareCreator = () => {
    return (next) => async (action) => {
        next(action);
    };
};

export function resolveModuleWithCallback<T>(
    moduleName: string,
    callback: (module: T) => void
): void {
    if (isLoaded(moduleName)) {
        callback(loadSync(moduleName));
    } else {
        loadAsync(moduleName).then((module) => {
            callback(module as T);
        });
    }
}
