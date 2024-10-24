import { TFontColorStyle } from 'Controls/interface';
import { TemplateFunction } from 'UI/Base';

/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
/**
 * Шаблон, который по умолчанию используется для отображения выбранных значений в контролах {@link Controls/lookup:Input} и {@link Controls/lookup:Selector}.
 *
 * @class Controls/lookup:ItemTemplate
 * @public
 * @see Controls/lookup
 * @see Controls/lookup:Input
 *
 * @remark
 *
 * Если вы переопределите contentTemplate/crossTemplate, вы не будете уведомлены о событиях itemClick/crossClick.
 * Для правильной работы необходимо пометить свой контент классами:
 *
 * * js-controls-SelectedCollection__item__caption
 * * js-controls-SelectedCollection__item__cross
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.lookup:Selector
 *     source="{{_source}}"
 *     keyProperty="id">
 *     <ws:itemTemplate>
 *         <ws:partial template="Controls/lookup:ItemTemplate"
 *             style="primary"
 *             size="xl"
 *             displayProperty="title"
 *             clickable="{{true}}" />
 *     </ws:itemTemplate>
 * </Controls.lookup:Selector>
 * </pre>
 */

export default interface IItemTemplateOptions {
    /**
     * @name Controls/lookup:ItemTemplate#crossTemplate
     * @cfg {String|TemplateFunction|null} Шаблон крестика удаления элемента.
     * @remark Если вы задаёте свой крестик удаления, то на него надо повесить класс js-controls-SelectedCollection__item__cross,
     * чтобы контрол выбора мог отследить клик по крестику.
     * Если шаблон крестика передать как null, то крестик будет скрыт.
     * @example
     * В следующем примере крестик удаления будет скрыт
     * <pre class="brush: html; highlight: [7]">
     *   <Controls.lookup:Selector
     *     source="{{_source}}"
     *     keyProperty="id">
     *     <ws:itemTemplate>
     *         <ws:partial template="Controls/lookup:ItemTemplate"
     *             scope="{{itemTemplate}}"
     *             crossTemplate="{{null}}" />
     *     </ws:itemTemplate>
     *  </Controls.lookup:Selector>
     */
    crossTemplate?: string | TemplateFunction;
    /**
     * @name Controls/lookup:ItemTemplate#contentTemplate
     * @cfg {String|TemplateFunction} Шаблон содержимого элемента.
     * @remark Вы можете получить доступ к записи в области видимости шаблона из поля item.
     * @example
     * В следующем примере определяется свой шаблон для отображения данных
     * <pre class="brush: html; highlight: [6-8]">
     *   <Controls.lookup:Selector
     *     source="{{_source}}"
     *     keyProperty="id">
     *     <ws:itemTemplate>
     *         <ws:partial template="Controls/lookup:ItemTemplate" scope="{{itemTemplate}}">
     *             <ws:contentTemplate>
     *                 <div>{{itemTemplate.item.get('myField')}}</div>
     *             </ws:contentTemplate>
     *         </ws:partial>
     *     </ws:itemTemplate>
     *  </Controls.lookup:Selector>
     * </pre>
     */
    contentTemplate: string | TemplateFunction;
    /**
     * @name Controls/lookup:ItemTemplate#displayProperty
     * @cfg {String} Название поля, значение которого отображается при выборе элемента.
     */
    displayProperty?: string;
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
