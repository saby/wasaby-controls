import { loadSync } from 'WasabyLoader/ModulesLoader';

export function getSearchResolver(): typeof import('Controls/search').FilterResolver {
    return loadSync<typeof import('Controls/search')>('Controls/search').FilterResolver;
}
