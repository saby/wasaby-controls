/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { CrudEntityKey } from 'Types/source';
import type { expandCollapse } from '../types';

export const expand = (key: CrudEntityKey): expandCollapse.TExpandAction => ({
    type: 'expand',
    payload: {
        key,
    },
});

export const collapse = (key: CrudEntityKey): expandCollapse.TCollapseAction => ({
    type: 'collapse',
    payload: {
        key,
    },
});
