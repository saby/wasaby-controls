/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TFontWeight } from 'Controls/_interface/IFontWeight';

/**
 * Шаблон, который по умолчанию используется для отображения ячеек {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/template/#columns итогов} в {@link Controls/grid:View таблице}.
 *
 * @class Controls/_grid/interface/ResultColumnTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [7-12]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}">
 *    <ws:columns>
 *       <ws:Array>
 *          <ws:Object displayProperty="Name">
 *             <ws:resultTemplate>
 *                <ws:partial template="Controls/grid:ResultColumnTemplate">
 *                    <div title="{{resultTemplate.results.get('Name')}}">
 *                       {{resultTemplate.results.get('Name')}}
 *                    </div>
 *                </ws:partial>
 *             </ws:resultTemplate>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:columns>
 * </Controls.grid:View>
 * </pre>
 * @public
 */
export default interface IResultColumnTemplateOptions {
    /**
     * @cfg {String|TemplateFunction} Пользовательский шаблон для отображения содержимого ячейки итогов.
     * @remark
     * В области видимости шаблона доступен объект **results** - итогов, которые были переданы в метаданных RecordSet.
     * Результаты должны быть переданы в виде {@link Types/entity:Model}.
     * Если шаблон ячейки итогов или контентная опция не заданы, будут выведены итоги из метаданных по ключу, соответствующему displayProperty для данной колонки.
     * @markdown
     * @example
     * **Пример 1.** Переопределение шаблона итогов и конфигурация контрола в одном WML-файле.
     * <pre class="brush: html; highlight: [7-11]">
     * <!-- WML -->
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="Name">
     *             <ws:resultTemplate>
     *                <ws:partial template="Controls/grid:ResultColumnTemplate">
     *                    <div title="{{resultTemplate.results.get('Name')}}">
     *                       {{resultTemplate.results.get('Name')}}
     *                    </div>
     *                </ws:partial>
     *             </ws:resultTemplate>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     *
     * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
     * <pre class="brush: html; highlight: [6-8]">
     * <!-- file1.wml -->
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="Name">
     *             <ws:resultTemplate>
     *                <ws:partial template="wml!file2" scope="{{resultTemplate}}"/>
     *             </ws:resultTemplate>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     *
     * <pre class="brush: html;">
     * <!-- file2.wml -->
     * <ws:partial template="Controls/grid:ResultColumnTemplate">
     *     <div title="{{resultTemplate.results.get('Name')}}">
     *        {{results.get('Name')}}
     *     </div>
     * </ws:partial>
     * </pre>
     *
     * **Пример 3.** Переопределение стандартных параметров отображения результатов.
     * <pre class="brush: html; highlight: [6-8]">
     * <!-- WML -->
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="Name">
     *             <ws:resultTemplate>
     *                <ws:partial template="Controls/grid:ResultColumnTemplate" fontWeight="default" fontColorStyle="unaccented"/>
     *             </ws:resultTemplate>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     *
     * **Пример 4.** Конфигурация ячейки для выравнивания контента по копейкам. На шаблон добавлен CSS-класс "controls-Grid&#95;&#95;cell&#95;spacing&#95;money".
     * <pre class="brush: html; highlight: [6-8]">
     * <!-- WML -->
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="Name">
     *             <ws:resultTemplate>
     *                <ws:partial template="Controls/grid:ResultColumnTemplate" attr:class="controls-Grid__cell_spacing_money" />
     *             </ws:resultTemplate>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     */
    content?: string;

    /**
     * @description Допустимые значения для опции {@link fontWeight}.
     * @typedef {String} Controls/_grid/interface/ResultColumnTemplate/TFontWeight
     * @variant bold
     * @variant default
     */

    /**
     * @cfg {Controls/_grid/interface/ResultColumnTemplate/TFontWeight.typedef} Насыщенность шрифта.
     * @default bold
     */
    fontWeight?: TFontWeight;

    /**
     * @typedef {String} Controls/_grid/interface/ResultColumnTemplate/BackgroundColorStyle
     * @description Допустимые значения для опции {@link backgroundColorStyle}.
     * @variant danger
     * @variant success
     * @variant warning
     * @variant primary
     * @variant secondary
     * @variant unaccented
     * @variant readonly
     */
    /**
     * @cfg {Controls/_grid/interface/ResultColumnTemplate/BackgroundColorStyle.typedef} Стиль фона ячейки.
     */
    backgroundColorStyle?: string;

    /**
     * @description Допустимые значения для опции {@link fontColorStyle}.
     * @typedef {String} Controls/_grid/interface/ResultColumnTemplate/FontColorStyle
     * @variant secondary
     * @variant success
     * @variant danger
     * @variant readonly
     * @variant unaccented
     */

    /**
     * @cfg {Controls/_grid/interface/ResultColumnTemplate/FontColorStyle.typedef} Стиль цвета текста результатов.
     * @default secondary
     * @remark
     * Стиль цвета текста задается константой из стандартного набора цветов, который определен для текущей темы оформления.
     * @example
     * Шаблон ячейки результатов со стилем шрифта "success".
     * <pre class="brush: html">
     * <ws:partial template="Controls/grid:ResultColumnTemplate" scope="{{_options}}" fontColorStyle="success" />
     * </pre>
     */
    fontColorStyle?: string;
}
