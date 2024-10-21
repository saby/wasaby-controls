/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { CrudEntityKey } from 'Types/source';
import type { expandCollapse } from '../types';

/**
 * Конструктор действия, для разворота узла.
 * @function
 * @param {CrudEntityKey} key Ключ узла.
 * @return expandCollapse.TExpandAction
 */
export const expand = (key: CrudEntityKey): expandCollapse.TExpandAction => ({
    type: 'expand',
    payload: {
        key,
    },
});

/**
 * Конструктор действия, для сворачивания узла.
 * @function
 * @param {CrudEntityKey} key Ключ узла.
 * @return expandCollapse.TCollapseAction
 */
export const collapse = (key: CrudEntityKey): expandCollapse.TCollapseAction => ({
    type: 'collapse',
    payload: {
        key,
    },
});
