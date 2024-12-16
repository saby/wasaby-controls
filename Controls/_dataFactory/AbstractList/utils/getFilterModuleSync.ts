/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';

export function getFilterModuleSync(): typeof import('Controls/filter') {
    return loadSync<typeof import('Controls/filter')>('Controls/filter');
}
