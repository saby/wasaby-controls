/*
 * Служебный файл, экспортирующий тип для аспектов дерева, работающих в режиме совместимости.
 */
import type { TCompatibilityForUndoneAspects as TBaseControlCompatibilityForUndoneAspects } from 'Controls/baseList';
import type {
    BaseTreeControl as TBaseTreeControl,
    IBaseTreeControlOptions,
} from '../../BaseTreeControl';
import { TKey } from 'Controls/interface';

/**
 * Тип для аспектов дерева, работающих в режиме совместимости.
 */
export type TCompatibilityForUndoneAspects = TBaseControlCompatibilityForUndoneAspects & {
    /**
     * Метод, возвращающий развёрнутые узлы
     * @param treeControl
     * @param options
     */
    getExpandedItemsCompatible(
        treeControl: TBaseTreeControl,
        options: IBaseTreeControlOptions
    ): TKey[] | undefined;

    /**
     * Метод, вызываемый в начале перетаскивания записи. Позволяет, например, свернуть перетаскиваемый узел.
     * @param treeControl
     * @param options
     */
    beforeStartDragCompatible(
        key: TKey,
        treeControl: TBaseTreeControl,
        options: IBaseTreeControlOptions
    ): void;
};
