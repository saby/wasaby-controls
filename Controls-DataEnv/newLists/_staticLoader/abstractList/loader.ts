import { TState } from './types';
import { LibPaths, UI_DEPENDENCIES } from './constants';
import _baseLoader from '../base/loader';

/**
 * Метод, который загрузит все необходимые библиотеки, для корректной работы интерактора с переданным состоянием.
 */
export async function getUnloadedDeps(
    state: TState,
    shouldAddPageDeps: boolean = false
): Promise<void> {
    await _baseLoader(
        Object.keys(UI_DEPENDENCIES) as LibPaths[],
        state,
        UI_DEPENDENCIES,
        shouldAddPageDeps
    );
}
