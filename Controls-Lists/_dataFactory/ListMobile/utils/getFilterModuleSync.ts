/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';

declare type TResult = typeof import('Controls/filter');

export function getFilterModuleSync(): TResult {
    return loadSync<TResult>('Controls/filter');
}
