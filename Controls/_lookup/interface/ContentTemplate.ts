import { TFontColorStyle } from 'Controls/interface';

/**
 * Контент, который по умолчанию используется для отображения данных в шаблоне {@link Controls/lookup:ItemTemplate}
 *
 * @class Controls/lookup:ItemContentTemplate
 * @public
 * @see Controls/lookup
 * @see Controls/lookup:Input
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.lookup:Selector
 *     source="{{_source}}"
 *     keyProperty="id">
 *     <ws:itemTemplate>
 *         <ws:partial template="Controls/lookup:ItemTemplate">
 *             <ws:partial template="Controls/lookup:ItemContentTemplate"/>
 *         </ws:partial>
 *     </ws:itemTemplate>
 * </Controls.lookup:Selector>
 * </pre>
 */

export default interface IItemTemplateOptions {
    /**
     * @name Controls/lookup:ItemTemplate#displayProperty
     * @cfg {String} Название поля, значение которого отображается при выборе элемента.
     */
    displayProperty?: string;
    /**
     * @name Controls/lookup:ItemTemplate#displayProperty
     * @cfg {String} Значение, которое отображается при выборе элемента.
     */
    caption?: string;
    /**
     * @name Controls/lookup:ItemTemplate#displayProperty
     * @cfg {String} Значение, которое отображается при наведении на элемент.
     */
    tooltip?: string;
    /**
     * @name Controls/lookup:ItemTemplate#clickable
     * @cfg {Boolean} Позволяет установить кликабельность выбранного значения.
     *
     * @remark
     * Использование параметра допустимо только в случае применения contentTemplate по умолчанию.
     */
    clickable?: boolean;
    /**
     * @name Controls/lookup:ItemTemplate#size
     * @cfg {String} Размер записей.
     *
     * @remark
     * Использование параметра допустимо только в случае применения contentTemplate по умолчанию.
     * Доступные значения: m, l, xl, 2xl, 3xl.
     */
    size?: string;
    /**
     * @name Controls/lookup:ItemTemplate#fontColorStyle
     * @cfg {String} Cтиль записей.
     *
     * @remark
     * Использование параметра допустимо только в случае применения contentTemplate по умолчанию.
     */
    fontColorStyle?: TFontColorStyle;

    /**
     * @name Controls/lookup:ItemTemplate#fontWeight
     * @cfg {String} Насыщенность шрифта.
     *
     * @remark
     * Использование параметра допустимо только в случае применения contentTemplate по умолчанию.
     * Доступные значения: bold.
     */
    fontWeight?: string;
}
