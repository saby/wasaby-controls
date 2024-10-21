/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
    declaredChildrenProperty?: string;

    expandedItems: TKey[];
    collapsedItems: TKey[];
    expansionModel: TExpansionModel;
    singleExpand?: boolean;
}
