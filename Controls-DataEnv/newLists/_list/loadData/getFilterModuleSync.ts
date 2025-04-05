/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type * as FilterModule from 'Controls/filter';

/**
 * Синхронная загрузка модуля фильтра
 */
export function getFilterModuleSync(): typeof FilterModule {
    return loadSync<typeof FilterModule>('Controls/filter');
}
