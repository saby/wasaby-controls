import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UICommon/Deps';
import type { TState, TDependencyDescriptor, TUI_Dependencies } from './types';

export async function getUnloadedDeps(
    state: TState,
    dependencies: TUI_Dependencies,
    shouldAddPageDeps: boolean = false
): Promise<void> {
    const checkValue = (descriptor: TDependencyDescriptor<keyof TState>) => {
        if (typeof descriptor.value === 'function') {
            return descriptor.value(state);
        } else {
            return !!descriptor.value.find((v) => v === state[descriptor.prop]);
        }
    };

    // На сервисе представления isLoaded всегда true, не нужно проверять на него.
    // Нам нужны эти файлы, считаем что их нет, тогда сервис раздаст нам их.
    const checkIsLoaded = (path: string) => (shouldAddPageDeps ? false : isLoaded(path));

    const requiredDeps = Object.keys(dependencies).filter(
        (path) => !checkIsLoaded(path) && !!dependencies[path].find(checkValue)
    );

    // Можно не делать проверку, т.к. на клиенте addPageDeps - пустышка.
    if (shouldAddPageDeps) {
        addPageDeps(requiredDeps);
    }

    await Promise.all(requiredDeps.map((path) => loadAsync(path)));
}
