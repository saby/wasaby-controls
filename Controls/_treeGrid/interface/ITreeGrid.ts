/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { ITree, ITreeControlOptions } from 'Controls/tree';
import { IGridControl } from 'Controls/grid';
import { IOptions as IGridOptions } from 'Controls/_baseGrid/display/mixins/Grid';

/**
 * Доступные значения для {@link Controls/_treeGrid/interface/ITreeGrid#groupNodeVisibility видимости групп в иерархической группировке}
 * @typedef {String} Controls/_treeGrid/interface/ITreeGrid/TGroupNodeVisibility
 * @variant visible Всегда показывать полученные из источника данных группы в иерархической группировке.
 * @variant hasdata Показывать полученные из источника данных группы в иерархической группировке только если в метаданных передан параметр singleGroupNode со значением, отличным от true.
 */
export type TGroupNodeVisibility = 'hasdata' | 'visible';

export interface IOptions extends Partial<ITreeControlOptions>, Partial<IGridOptions> {
    groupNodeVisibility?: TGroupNodeVisibility;
    deepScrollLoad?: boolean;
}

/**
 * Интерфейс дерева-таблицы
 * @implements Controls/interface/IGroupedList
 *
 * @ignoreOptions resultsTemplate resultsTemplateOptions
 * @public
 */
export default interface ITreeGrid extends ITree, IGridControl {
    readonly '[Controls/_treeGrid/interface/ITreeGrid]': true;
}

/**
 * @name Controls/_treeGrid/interface/ITreeGrid#nodeTypeProperty
 * @cfg {String} Имя свойства, содержащего информацию о типе узла.
 * @remark
 * Используется для отображения узлов в виде групп. (См. {@link Controls/treeGrid:IGroupNodeColumn Колонка списка с иерархической группировкой.})
 * Если в RecordSet в указанном свойстве с БЛ приходит значение 'group', то такой узел должен будет отобразиться как группа.
 * При любом другом значении узел отображается как обычно с учётом nodeProperty
 * @example
 * В следующем примере показано, как настроить список на использование узлов-групп
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *    source="{{_source}}"
 *    nodeProperty="{{parent@}}"
 *    parentProperty="{{parent}}"
 *    nodeTypeProperty="customNodeType"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * class MyControl extends Control<IControlOptions> {
 *    _source: new Memory({
 *        keyProperty: 'id',
 *        data: [
 *            {
 *                id: 1,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *            {
 *                id: 2,
 *                customNodeType: null,
 *                ...
 *            },
 *            {
 *                id: 3,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *        ]
 *    })
 * }
 * </pre>
 */

/**
 * @name Controls/_treeGrid/interface/ITreeGrid#groupNodeVisibility
 * @cfg {Controls/_treeGrid/interface/ITreeGrid/TGroupNodeVisibility.typedef} Видимость групп в иерархической группировке
 * @variant visible Всегда показывать полученные из источника данных группы в иерархической группировке.
 * @variant hasdata Показывать полученные из источника данных группы в иерархической группировке только если в метаданных передан параметр singleGroupNode со значением, отличным от true.
 * @default visible
 */

/**
 * @name Controls/_treeGrid/interface/ITreeGrid#deepScrollLoad
 * @cfg {String} Флаг, позволяющий запрашивать дочерние узлы при подгрузке по скроллу.
 * @remark
 * Опция необходима для подгрузки дерева с раскрытыми узлами по скроллу. При этом необходимо с БЛ линейно
 * возвращать строго отсортированные данные дерева с раскрытыми узлами.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeGrid#columns
 * @cfg {Array.<Controls/treeGrid:IColumn>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/ колонок} дерева с колонками.
 * @remark
 * Если при отрисовске контрола данные не отображаются или выводится только их часть, то следует проверить {@link Controls/collection:RecordSet}, полученный от {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * Такой RecordSet должен содержать набор полей, которые заданы в конфигурации контрола в опции columns, а также сами данные для каждого поля.
 * @example
 * <pre class="brush: js">
 * _columns: null,
 * _beforeMount: function() {
 *    this._columns = [
 *       {
 *          displayProperty: 'name',
 *          width: '1fr',
 *          align: 'left',
 *          template: _customNameTemplate
 *       },
 *       {
 *          displayProperty: 'balance',
 *          align: 'right',
 *          width: 'auto',
 *          resutTemplate: _customResultTemplate,
 *          result: 12340
 *       }
 *    ];
 * }
 * </pre>
 * <pre class="brush: html">
 *  <Controls.grid:View columns="{{_columns}}" />
 * </pre>
 */

/**
 * Пользовательский шаблон отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов}.
 * @name Controls/_treeGrid/interface/ITreeGrid#resultsTemplate
 * @cfg {UI/Base:TemplateFunction|String}
 * @default undefined
 * @demo Controls-demo/gridNew/Results/ResultsTemplate/Index
 * @markdown
 * @remark
 * По умолчанию при видимой {@link Controls/_treeGrid/TreeGrid#expanderVisibility кнопке разворота узла} в первую ячейку итогов таблицы добавляется отступ, позволяющий отобразить содержимое на одоной вертикаоьной линии.
 * Для того, чтобы убрать этот отступ, необходимо в {@link resultsTemplateOptions опциях шаблона строки итогов} или в {@link Controls/_grid/display/interface/IColumn#resultTemplateOptions опциях ячейки строки итогов} в передать параметр withoutExpanderPadding и присвоить ему значение true.
 *
 * Позволяет установить пользовательский шаблон отображения строки итогов (именно шаблон, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона Controls/grid:ResultsTemplate.
 *
 * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию resultsTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/grid:ResultTemplate.
 *
 * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/template/ руководстве разработчика}.
 *
 * Для отображения строки итогов необходимо задать значение в опции {@link resultsPosition}.
 * @see resultsPosition
 * @see resultsVisibility
 */

/**
 * Объект с параметрами, которые будут установлены в {@link Controls/_treeGrid/interface/ITreeGrid#resultsTemplate шаблон строки итогов}.
 * @remark
 * По умолчанию при видимой {@link Controls/_treeGrid/TreeGrid#expanderVisibility кнопке разворота узла} в первую ячейку итогов таблицы добавляется отступ, позволяющий отобразить содержимое на одоной вертикаоьной линии.
 * Для того, чтобы убрать этот отступ, необходимо передать параметр withoutExpanderPadding и присвоить ему значение true.
 * @remark
 * Аналогичную настройку при необходимости можно сделать в {@link Controls/_grid/display/interface/IColumn#resultTemplateOptions опциях ячейки строки итогов}.
 * @name Controls/_treeGrid/interface/ITreeGrid#resultsTemplateOptions
 * @cfg {Object}
 * @default undefined
 * @see resultsTemplate
 */
