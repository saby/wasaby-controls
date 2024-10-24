/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Интерфейс для контентной опции шаблона отображения элемента в {@link Controls/list:View плоском списке}.
 * @interface Controls/_list/interface/IContentTemplate
 * @see Controls/list:View
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [5-7]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *             {{contentTemplate.item.contents.title}}
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 *
 * @public
 */

export default interface IContentTemplateOptions {
    /**
     * @name Controls/_list/interface/IContentTemplate#contentTemplate
     * @cfg {String|UI/Base:TemplateFunction|undefined} Пользовательский шаблон, описывающий содержимое элемента.
     * @markdown
     * @remark
     * В области видимости шаблона доступны переменные **item** и **itemActionsTemplate**.
     * С помощью **itemActionsTemplate** можно отобразить панель {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи} в пользовательском шаблоне. Переменную достаточно встроить в нужное место contentTemplate с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}, что показано в примере № 4.
     * Переменная **item** позволяет получить доступ к свойству **contents** — это объект, который содержит данные обрабатываемого элемента. Также, можно получить доступ к методу isMarked(), с помощью которого можно определить, отмечена ли запись {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
     *
     * @example
     *
     * В следующих примерах показано, как изменять опции шаблона для контрола {@link Controls/list:View}, однако то же самое справедливо и для других {@link /doc/platform/developmentapl/interface-development/controls/list/ списочных контролов}.
     * В примерах ниже показано, как получить доступ к переменной item из области видимости шаблона.
     *
     * **Пример 1.** Контрол и шаблон настроены в одном WML-файле.
     * <pre class="brush: html; highlight: [6]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
     *          <ws:contentTemplate>
     *             {{contentTemplate.item.contents.title}}
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * **Пример 2.** Контрол и шаблон itemTemplate настроены в отдельных WML-файлах.
     * <pre class="brush: html; highlight: [4]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:itemTemplate>
     *       <ws:partial template="wml!file2" scope="{{itemTemplate}}"/>
     *    </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * <ws:partial template="Controls/list:ItemTemplate">
     *    <ws:contentTemplate>
     *       {{contentTemplate.item.contents.title}}
     *    </ws:contentTemplate>
     * </ws:partial>
     * </pre>
     *
     * **Пример 3.** Контрол и шаблон contentTemplate настроены в отдельных WML-файлах.
     *
     * <pre class="brush: html; highlight: [5]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/list:ItemTemplate">
     *          <ws:contentTemplate>
     *             <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * {{contentTemplate.item.contents.title}}
     * </pre>
     *
     * **Пример 4.** Контрол и шаблон настроены в одном WML-файле. В пользовательском шаблоне задано отображение опций записи.
     * <pre class="brush: html; highlight: [7]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/list:ItemTemplate" scope="{{itemTemplate}}">
     *          <ws:contentTemplate>
     *             {{contentTemplate.item.contents.title}}
     *             <ws:partial template="{{contentTemplate.itemActionsTemplate}}" />
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     *
     */
    contentTemplate?: string;
}
