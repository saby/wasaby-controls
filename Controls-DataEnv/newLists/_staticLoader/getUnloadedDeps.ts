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

    const requiredDeps = Object.keys(dependencies).filter(
        (path) => !isLoaded(path) && !!dependencies[path].find(checkValue)
    );

    if (shouldAddPageDeps) {
        addPageDeps(requiredDeps);
    }

    await Promise.all(requiredDeps.map((path) => loadAsync(path)));
}
