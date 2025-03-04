import type { expandCollapse } from '../types';
import type { CrudEntityKey } from 'Types/source';
import type { TExpansionModel } from '../../interface/IAbstractListStateParts/IHierarchyState';
import aCreator from './_actionCreator';

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
): expandCollapse.TExpandAction =>
    aCreator('expand', {
        key,
        markItem,
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
): expandCollapse.TCollapseAction =>
    aCreator('collapse', {
        key,
        markItem,
    });

/**
 * Конструктор действия для сброса состояния развернутости узлов.
 * @function
 * @return expandCollapse.TResetExpansionAction
 */
export const resetExpansion = (): expandCollapse.TResetExpansionAction =>
    aCreator('resetExpansion');

/**
 * Конструктор действия для обновления модели раскрытых узлов.
 */
export const setExpansionModel = (
    expansionModel: TExpansionModel
): expandCollapse.TSetExpansionModelAction => aCreator('setExpansionModel', { expansionModel });
