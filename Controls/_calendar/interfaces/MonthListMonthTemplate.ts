/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
/**
 * Шаблон, который по умолчанию используется для отображения месяца в {@link Controls/calendar:MonthView}.
 * @class Controls/calendar:MonthListMonthTemplate
 * @public
 */

/**
 * @name Controls/calendar:MonthListMonthTemplate#bodyTemplate
 * @cfg {String|TemplateFunction} Шаблон отображения месяца
 * @remark
 * В шаблон будет переданы:
 *
 * * date - дата месяа
 * * extData - данные, загруженные через источник данных
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList>
 *     <ws:monthTemplate>
 *         <ws:partial template="Controls/calendar:MonthListMonthTemplate">
 *             <ws:bodyTemplate>
 *                 <Controls.calendar:MonthView/>
 *             </ws:bodyTemplate>
 *         </ws:partial>
 *     </ws:monthTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 */
