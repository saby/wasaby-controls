/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/**
 * Шаблон, который по умолчанию используется для отображения строки {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ итогов} в {@link Controls/grid:View таблице}.
 *
 * @class Controls/_grid/interface/ResultsTemplate
 * @see Controls/grid:View#resultsTemplate
 * @see Controls/grid:View#resultsPosition
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ здесь}.
 * @example
 * <pre class="brush: html; highlight: [4-10]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:resultsTemplate>
 *       <ws:partial template="Controls/grid:ResultsTemplate">
 *          <ws:contentTemplate>
 *             <div style="color: #313E78;">
 *                Итого: 2 страны с населением более миллиарда человек.
 *             </div>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:resultsTemplate>
 * </Controls.grid:View>
 * </pre>
 * @public
 */

export default interface IResultsTemplateOptions {
    /**
     * @name Controls/_grid/interface/ResultsTemplate#contentTemplate
     * @cfg {String|TemplateFunction} Пользовательский шаблон, описывающий содержимое строки итогов.
     * @default undefined
     */
    contentTemplate?: string;
}
