import { TListMiddlewareCreator } from '../types/TListMiddleware';
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
