import { isLoaded } from 'WasabyLoader/ModulesLoader';
import load from './load';
import type { TDependencyDescriptor, TUI_Dependencies } from './types';

export default async function _baseLoader<TState extends Record<string, unknown>>(
    libPaths: string[],
    state: TState,
    dependencies: TUI_Dependencies<TState>,
    shouldAddPageDeps: boolean = false
): Promise<void> {
    const checkValue = (descriptor: TDependencyDescriptor<TState>) => {
        if (typeof descriptor === 'function') {
            return descriptor(state);
        } else {
            return !!descriptor.value.find((v) => v === state[descriptor.prop]);
        }
    };

    // На сервисе представления isLoaded всегда true, не нужно проверять на него.
    // Нам нужны эти файлы, считаем что их нет, тогда сервис раздаст нам их.
    const checkIsLoaded = (path: string) => (shouldAddPageDeps ? false : isLoaded(path));

    const requiredDeps = libPaths.filter(
        (path) => !checkIsLoaded(path) && !!dependencies[path].find(checkValue)
    );

    await load(requiredDeps);
}
