/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';

export function getSearchResolver(): typeof import('Controls/search').FilterResolver {
    return loadSync<typeof import('Controls/search')>('Controls/search').FilterResolver;
}
