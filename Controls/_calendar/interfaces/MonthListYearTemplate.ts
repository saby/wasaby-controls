/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
/**
 * Шаблон, который по умолчанию используется для отображения года в {@link Controls/calendar:MonthView}.
 * @class Controls/calendar:MonthListYearTemplate
 * @public
 */

/**
 * @name Controls/calendar:MonthListYearTemplate#bodyTemplate
 * @cfg {String|TemplateFunction} Шаблон отображения года.
 * @remark
 * В шаблон будет переданы:
 *
 * * date - дата месяца.
 * * extData - данные, загруженные через источник данных
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList>
 *     <ws:yearTemplate>
 *         <ws:partial template="Controls/calendar:MonthListYearTemplate">
 *             <ws:bodyTemplate>
 *                 <ws:for data="month in 12">
 *                     <Controls.calendar:MonthView/>
 *                 </ws:for>
 *             </ws:bodyTemplate>
 *         </ws:partial>
 *     </ws:yearTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 */
