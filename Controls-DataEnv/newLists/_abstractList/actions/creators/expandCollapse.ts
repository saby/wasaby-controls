import type { expandCollapse } from '../types';
import type { CrudEntityKey } from 'Types/source';

/**
 * Конструктор действия для разворота узла.
 * @function
 * @param {CrudEntityKey} key Ключ узла
 * @param {Boolean} markItem Определяет будет ли развернутый узел отмечен маркером
 * @return expandCollapse.TExpandAction
 */
export const expand = (
    key: CrudEntityKey,
    markItem: boolean = true
): expandCollapse.TExpandAction => ({
    type: 'expand',
    payload: {
        key,
        markItem,
    },
});

/**
 * Конструктор действия для сворачивания узла.
 * @function
 * @param {CrudEntityKey} key Ключ узла
 * @param {Boolean} markItem Определяет будет ли развернутый узел отмечен маркером
 * @return expandCollapse.TCollapseAction
 */
export const collapse = (
    key: CrudEntityKey,
    markItem: boolean = true
): expandCollapse.TCollapseAction => ({
    type: 'collapse',
    payload: {
        key,
        markItem,
    },
});

/**
 * Конструктор действия для сброса состояния развернутости узлов.
 * @function
 * @return expandCollapse.TResetExpansionAction
 */
export const resetExpansion = (): expandCollapse.TResetExpansionAction => ({
    type: 'resetExpansion',
    payload: {},
});

/**
 * Конструктор действия для обновления модели раскрытых узлов.
 * @function
 * @return expandCollapse.TUpdateExpansionModelAction
 */
export const updateExpansionModel = (): expandCollapse.TUpdateExpansionModelAction => ({
    type: 'updateExpansionModel',
    payload: {},
});
