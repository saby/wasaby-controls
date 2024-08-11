import { loadSync } from 'WasabyLoader/ModulesLoader';

export function getFilterModuleSync(): typeof import('Controls/filter') {
    return loadSync<typeof import('Controls/filter')>('Controls/filter');
}
