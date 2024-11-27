import type { CrudEntityKey } from 'Types/source';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Модель раскрытых узлов.
 */
export type TExpansionModel = Map<CrudEntityKey, boolean>;

/**
 * Интерфейс состояния для работы с деревом.
 */
export interface IHierarchyState {
    parentProperty?: string;
    nodeProperty?: string;

    // Иерархия пока объединена, всё в одном, т.к. не надо.
    // TODO: Вынести в IRoot.
    root: TKey;

    // TODO: Вынести в IExpandCollapse.
    expandedItems: TKey[];
    collapsedItems: TKey[];
    expansionModel: TExpansionModel;
    singleExpand: boolean;
}
