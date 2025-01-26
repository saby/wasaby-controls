import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
const LIB = 'Controls/listVisualAspects';

export default function <T extends keyof typeof import('Controls/listVisualAspects')>(
    componentName: T
): (typeof import('Controls/listVisualAspects'))[T] | undefined {
    return isLoaded(LIB)
        ? loadSync<typeof import('Controls/listVisualAspects')>(LIB)[componentName]
        : undefined;
}
