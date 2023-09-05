/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
export interface IExpandedCompositeTree {
    compositeNodesLevel: number;
}

/**
 * Интерфейс контрола для отображения иерархии в развернутом виде и установке режима отображения элементов на каждом уровне вложенности
 *
 * @interface Controls/_expandedCompositeTree/interface/IExpandedCompositeTree
 * @public
 */

/**
 * @name Controls/_expandedCompositeTree/interface/IExpandedCompositeTree#compositeNodesLevel
 * @cfg {Number} Уровень вложенности, начиная с которого узлы отображаются в виде составного элемента.
 * @default 3
 */
