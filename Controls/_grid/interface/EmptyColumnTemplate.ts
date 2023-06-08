/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
/**
 * Шаблон, который по умолчанию используется для отображения {@link Controls/grid:View таблицы} без элементов в виде набора колонок.
 *
 * @class Controls/_grid/interface/EmptyColumnTemplate
 * @see Controls/grid:View#emptyTemplateColumns
 * @see Controls/grid:View#emptyTemplateOptions
 * @see Controls/grid:View
 * @see Controls/grid:EmptyTemplate
 * @example
 * <pre class="brush: html; highlight: [3-24]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *     <ws:emptyTemplateColumns>
 *         <ws:Array>
 *             <ws:Object startColumn="{{ 1 }}" endColumn="{{ 2 }}">
 *                 <ws:template>
 *                     <ws:partial template="Controls/grid:EmptyColumnTemplate">
 *                         <ws:partial template="Controls/list:EditingTemplate" enabled="{{ true }}">
 *                             <ws:viewTemplate>
 *                                 <div on:click="_beginAdd()">Введите наименование, штрих-код или артикул</div>
 *                             </ws:viewTemplate>
 *                         </ws:partial>
 *                     </ws:partial>
 *                 </ws:template>
 *             </ws:Object>
 *             <ws:Object startColumn="{{ 2 }}" endColumn="{{ 6 }}">
 *                 <ws:template>
 *                     <ws:partial template="Controls/grid:EmptyColumnTemplate" >
 *                         <div>или выберите из <a href="#" class="controls-text-link">каталога</a></div>
 *                     </ws:partial>
 *                 </ws:template>
 *             </ws:Object>
 *         </ws:Array>
 *     </ws:emptyTemplateColumns>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/ здесь}.
 * @public
 */

export default interface IEmptyColumnTemplateOptions {
    /**
     * @name Controls/_grid/interface/EmptyColumnTemplate#contentTemplate
     * @cfg {TemplateFunction|String} Шаблон, описывающий контент.
     */
    contentTemplate?: string;
}
