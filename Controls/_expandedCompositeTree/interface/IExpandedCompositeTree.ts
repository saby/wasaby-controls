/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
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
