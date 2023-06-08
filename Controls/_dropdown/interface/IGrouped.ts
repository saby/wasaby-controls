/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Интерфейс для выпадающих списков, поддерживающих группировку элементов.
 *
 * @interface Controls/_dropdown/interface/IGrouped
 * @public
 */
interface IGrouped {
    readonly '[Controls/_dropdown/interface/IGrouped]': boolean;
}

export default IGrouped;

export interface IGroupedOptions {
    /**
     * @name Controls/_dropdown/interface/IGrouped#groupTemplate
     * @cfg {Function} Шаблон отображения заголовка группы.
     * @markdown
     * @remark
     * Позволяет установить пользовательский шаблон отображения заголовка группы (**именно шаблон**, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/dropdown:GroupTemplate}. Шаблон Controls/dropdown:GroupTemplate поддерживает параметры, с помощью которых можно изменить отображение заголовка группы.
     *
     * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию groupTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/dropdown:GroupTemplate.
     * @demo Controls-demo/dropdown_new/Button/GroupProperty/GroupTemplate/Index
     * @see groupProperty
     * @example
     * <pre class="brush: html; highlight: [7,8,9,10]">
     * <!-- WML -->
     * <Controls.dropdown:Button
     *          keyProperty="key"
     *          caption="Create"
     *          viewMode="outlined"
     *          source="{{_source}}"
     *          groupProperty="group">
     *      <ws:groupTemplate>
     *          <ws:partial template="Controls/dropdown:GroupTemplate" showText="{{true}}"/>
     *      </ws:groupTemplate>
     * </Controls.dropdown:Button>
     * </pre>
     * <pre class="brush: js">
     * // JavaScript
     * this._source = new Memory({
     *    data: [
     *       { key: 1, title: 'Project', group: 'Select' },
     *       { key: 2, title: 'Work plan', group: 'Select' },
     *       { key: 3, title: 'Task', group: 'Select' },
     *       { key: 4, title: 'Merge request', group: 'Create' },
     *       { key: 5, title: 'Meeting', group: 'Create' },
     *       { key: 6, title: 'Video meeting', group: 'Create' }
     *    ],
     *    keyProperty: 'id'
     * });
     * </pre>
     */
    groupTemplate?: TemplateFunction;
    /**
     * @name Controls/_dropdown/interface/IGrouped#groupProperty
     * @cfg {String} Имя свойства, содержащего идентификатор группы элемента списка.
     * @variant item Элемент списка.
     * @see groupTemplate
     * @demo Controls-demo/dropdown_new/Button/GroupProperty/Simple/Index
     * @example
     * <pre class="brush: html; highlight: [7]">
     * <!-- WML -->
     * <Controls.dropdown:Button
     *    keyProperty="key"
     *    caption="Create"
     *    viewMode="outlined"
     *    source="{{_source}}"
     *    groupProperty="group" />
     * </pre>
     * <pre class="brush: js;">
     * // JavaScript
     * this._source = new Memory({
     *    data: [
     *        { key: 1, title: 'Project', group: 'Select' },
     *        { key: 2, title: 'Work plan', group: 'Select' },
     *        { key: 3, title: 'Task', group: 'Select' },
     *        { key: 4, title: 'Merge request', group: 'Create' },
     *        { key: 5, title: 'Meeting', group: 'Create' },
     *        { key: 6, title: 'Video meeting', group: 'Create' }
     *    ],
     *    keyProperty: 'key'
     * });
     * </pre>
     */
    groupProperty?: string;
}
