/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
/**
 * Шаблон, который по умолчанию используется для отображения {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения} в виде {@link Controls/list:View плоского списка}.
 * @class Controls/suggestPopup:SuggestTemplate
 * @demo Controls-demo/Lookup/MultipleInputNew/MultipleInputNew
 * @mixes Controls/explorer:View
 * @public
 * @ignoreOptions dataLoadCallback source sourceController
 * @example
 * <pre class="brush: html; highlight: [3]">
 * <!-- WML -->
 * <Controls.SuggestInput>
 *    <ws:suggestTemplate templateName="Controls/suggestPopup:SuggestTemplate"/>
 * </Controls.SuggestInput>
 * </pre>
 */

/**
 * @name Controls/suggestPopup:SuggestTemplate#displayProperty
 * @cfg {string} Задаёт отображаемое поле записи, которое выводится в записи автодополнения
 */

/**
 * @name Controls/suggestPopup:SuggestTemplate#fontSize
 * @cfg {string} Задаёт отображаемое поле записи, которое выводится в записи автодополнения
 */

/**
 * @name Controls/suggestPopup:SuggestTemplate#columns
 * @cfg {Array.<Controls/grid:IColumn>} Задаёт колонки для списка автодополнения
 */
