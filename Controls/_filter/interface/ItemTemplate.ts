/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
/**
 * Шаблон, который по умолчанию используется для отображения фильтра в области значений {@link Controls/filter:View Объединенного фильтра}.
 * @class Controls/filter:ItemTemplate
 * @public
 */
export default interface IItemTemplateOptions {
    /**
     * @name Controls/filter:ItemTemplate#beforeContentTemplate
     * @cfg {String} Шаблон, который отображается перед фильтром.
     * @default undefined
     * @remark
     * По умолчанию шаблон отображает треугольник.
     * Чтобы скрыть этот треугольник, в опцию beforeContentTemplate передайте значение null.
     */
    beforeContentTemplate?: string;
    /**
     * @name Controls/filter:ItemTemplate#contentTemplate
     * @cfg {String|TemplateFunction|undefined} Пользовательский шаблон, описывающий содержимое элемента.
     * @remark
     * В области видимости шаблона доступны две переменные — item и text.
     * @example
     * <pre class="brush: html">
     * <Controls.filter:View>
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/filter:ViewItemTemplate" scope="{{itemTemplate}}">
     *          <ws:contentTemplate>
     *          {{contentTemplate.item.contents.title}}
     *          {{contentTemplate.item.contents.text}}
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.filter:View>
     * </pre>
     */
    contentTemplate?: string;
    /**
     * @name Controls/filter:ItemTemplate#text
     * @cfg {String} Текст, отображаемый в области значений.
     * @default undefined
     */
    text?: string;
}
