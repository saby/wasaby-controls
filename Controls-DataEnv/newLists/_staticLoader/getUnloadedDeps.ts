import type { IAbstractListState } from 'Controls-DataEnv/abstractList';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UICommon/Deps';

import type { TDependencyDescriptor, TUI_Dependencies } from './types';

export async function getUnloadedDeps(
    state: IAbstractListState,
    dependencies: TUI_Dependencies,
    shouldAddPageDeps: boolean = false
): Promise<void> {
    const checkValue = (descriptor: TDependencyDescriptor<keyof IAbstractListState>) => {
        if (typeof descriptor.value === 'function') {
            return descriptor.value(state[descriptor.prop]);
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
