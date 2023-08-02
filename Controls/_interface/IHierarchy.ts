/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Тип сохряняемых в историю узлов
 * @typedef TNodeHistoryType
 * @variant nodes Только узлы
 * @variant groups Только группы
 * @variant all Узлы и группы
 */
export type TNodeHistoryType = 'node' | 'group' | 'all';

export interface IHierarchyOptions {
    nodeProperty?: string;
    parentProperty?: string;
    nodeHistoryId?: string;
    nodeHistoryType?: TNodeHistoryType;
}

/**
 * Интерфейс {@link /doc/platform/developmentapl/interface-development/controls/list/ иерархических списков}.
 * @interface Controls/_interface/IHierarchy
 * @public
 */
export default interface IHierarchy {
    readonly '[Controls/_interface/IHierarchy]': boolean;
}

/**
 * @name Controls/_interface/IHierarchy#nodeProperty
 * @cfg {String} Имя поля записи, в котором хранится информация о {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy типе элемента} (лист, узел, скрытый узел).
 * @example
 * В данном примере элемент с id: 4 является родителем для элементов с id: 5, 6, 7.
 * <pre classs="brush: html; highlight: [6]">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *     keyProperty="id"
 *     source="{{_source}}"
 *     parentProperty="parent"
 *     nodeProperty="parent@"/>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    data: [
 *       { id: 1, title: 'Task in development', parent: null, 'parent@': false },
 *       { id: 2, title: 'Error in development', parent: null, 'parent@': false },
 *       { id: 3, title: 'Application', parent: null, 'parent@': false },
 *       { id: 4, title: 'Assignment', parent: null, 'parent@': true },
 *       { id: 5, title: 'Assignment for accounting', parent: 4, 'parent@': false },
 *       { id: 6, title: 'Assignment for delivery', parent: 4, 'parent@': false },
 *       { id: 7, title: 'Assignment for logisticians', parent: 4, 'parent@': false }
 *    ],
 *    keyProperty: 'id'
 * });
 * </pre>
 */

/**
 * @name Controls/_interface/IHierarchy#parentProperty
 * @cfg {String} Имя поля записи, в котором хранится информация о родительском узле элемента.
 * @example
 * В данном примере элемент с id: 4 является родителем для элементов с id: 5, 6, 7.
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *     keyProperty="id"
 *     source="{{_source}}"
 *     parentProperty="parent"
 *     nodeProperty="parent@"/>
 * </pre>
 * <pre class="brush: js;"">
 * // JavaScript
 * this._source = new Memory({
 *    data: [
 *       { id: 1, title: 'Task in development', parent: null, 'parent@': false },
 *       { id: 2, title: 'Error in development', parent: null, 'parent@': false },
 *       { id: 3, title: 'Application', parent: null, 'parent@': false },
 *       { id: 4, title: 'Assignment', parent: null, 'parent@': true },
 *       { id: 5, title: 'Assignment for accounting', parent: 4, 'parent@': false },
 *       { id: 6, title: 'Assignment for delivery', parent: 4, 'parent@': false },
 *       { id: 7, title: 'Assignment for logisticians', parent: 4, 'parent@': false }
 *    ],
 *    keyProperty: 'id'
 * });
 * </pre>
 */

/*
 * @name Controls/_interface/IHierarchy#parentProperty
 * @cfg {String} Name of the field that contains information about parent node.
 * @example
 * In this example, item with id: 4 is parent for items with id: 5, 6, 7.
 * TMPL:
 * <pre>
 *    <Controls.treeGrid:View
 *       keyProperty="id"
 *       source="{{_source}}"
 *       parentProperty="parent"
 *       nodeProperty="parent@"/>
 * </pre>
 * JS:
 * <pre>
 *    this._source = new Memory({
 *       data: [
 *           { id: 1, title: 'Task in development', parent: null, 'parent@': false },
 *           { id: 2, title: 'Error in development', parent: null, 'parent@': false },
 *           { id: 3, title: 'Application', parent: null, 'parent@': false },
 *           { id: 4, title: 'Assignment', parent: null, 'parent@': true },
 *           { id: 5, title: 'Assignment for accounting', parent: 4, 'parent@': false },
 *           { id: 6, title: 'Assignment for delivery', parent: 4, 'parent@': false },
 *           { id: 7, title: 'Assignment for logisticians', parent: 4, 'parent@': false }
 *       ],
 *       keyProperty: 'id'
 *    });
 * </pre>
 */

/**
 * @name Controls/_interface/IHierarchy#nodeHistoryId
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее состояние развернутости узлов.
 */

/**
 * @name Controls/_interface/IHierarchy#nodeHistoryType
 * @cfg {TNodeHistoryType} Тип сохраняемых в историю узлов
 * @default group
 */

/**
 * @name Controls/_interface/IHierarchy#childrenProperty
 * @cfg {String} Имя поля узла, в котором хранится список детей.
 * @demo Controls-demo/tree/ChildrenProperty/Base/Index
 * @example
 * В данном примере элемент с id: 1 является родителем для элементов с id: 2, 3, 4.
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.tree:View
 *     source="{{_source}}"
 *     parentProperty="parent"
 *     childrenProperty="children"
 *     nodeProperty="node"/>
 * </pre>
 * <pre class="brush: js;"">
 * // JavaScript
 * this._source = new Memory({
 *    data: [
 *       {
 *          id: 1,
 *          title: 'Assignment',
 *          parent: null,
 *          node: true,
 *          children: new RecordSet({
 *              rawData: [
 *                  { id: 2, title: 'Assignment for accounting', parent: 1, node: null },
 *                  { id: 3, title: 'Assignment for delivery', parent: 1, node: null },
 *                  { id: 4, title: 'Assignment for logisticians', parent: 1, node: null }
 *              ],
 *              keyProperty: 'id'
 *          })
 *        },
 *    ],
 *    keyProperty: 'id'
 * });
 * </pre>
 */
