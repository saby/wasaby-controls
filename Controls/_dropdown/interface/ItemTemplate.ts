/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
/**
 * Шаблон, который по умолчанию используется для отображения элементов в выпадающих списках.
 * @remark
 * Подробнее о работе с выпадающими списками читайте {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/ здесь}.
 * @see Controls/_menu/interface/IMenuBase#itemTemplate
 * @class Controls/dropdown:ItemTemplate
 * @public
 * @example
 * <pre class="brush: html">
 * <Controls.dropdown:Button source="{{_source}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/dropdown:ItemTemplate" multiLine="{{true}}">
 *          <ws:contentTemplate>
 *             <div class="demo-menu__item">
 *                <div class="demo-title">{{contentTemplate.itemData.item.get('title')}}</div>
 *             </div>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.dropdown:Button>
 * </pre>
 * <pre class="brush: js">
 *    this._source = new Memory ({
 *       data: [
 *           { id: 1,
 *             title: 'Discussion',
 *             comment: 'Create a discussion to find out the views of other group members on this issue' },
 *           { id: 2,
 *             title: 'Idea/suggestion',
 *             comment: 'Offer your idea, which others can not only discuss, but also evaluate.
 *             The best ideas will not go unnoticed and will be realized' },
 *           { id: 3,
 *             title: 'Problem',
 *             comment: 'Do you have a problem? Tell about it and experts will help to find its solution' }
 *       ],
 *       keyProperty: 'id'
 *    });
 * </pre>
 */
/**
 * @typedef {String} IconAlign
 * @variant left Выравнивание слева.
 * @variant right Выравнивание справа.
 */

export default interface IItemTemplateOptions {
    /**
     * @name Controls/dropdown:ItemTemplate#contentTemplate
     * @cfg {String|TemplateFunction|undefined} Устанавливает пользовательский шаблон, описывающий содержимое элемента.
     * @default undefined
     * @markdown
     * @remark
     * В области видимости шаблона доступен объект **itemData**. Из него можно получить доступ к свойству **item** — это объект, который содержит данные обрабатываемого элемента.
     * @example
     *
     * В следующих примерах показано, как изменять опции шаблона для контрола {@link Controls/dropdown:Selector}, однако то же самое справедливо и для других {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/ выпадающих списков}.
     * В примерах №№ 1, 2 и 3 показано, как получить доступ к переменной itemData из области видимости шаблона.
     *
     * **Пример 1.** Контрол и шаблон настроены в одном WML-файле.
     * <pre class="brush: html">
     * <!-- file1.wml -->
     * <Controls.dropdown:Selector>
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/dropdown:ItemTemplate">
     *          <ws:contentTemplate>
     *             {{contentTemplate.itemData.item.title}}
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.dropdown:Selector>
     * </pre>
     *
     * **Пример 2.** Контрол и шаблон itemTemplate настроены в отдельных WML-файлах.
     * <pre class="brush: html">
     * <!-- file1.wml -->
     * <Controls.dropdown:Selector>
     *    <ws:itemTemplate>
     *       <ws:partial template="wml!file2" scope="{{itemTemplate}}"/>
     *    </ws:itemTemplate>
     * </Controls.dropdown:Selector>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * <ws:partial template="Controls/dropdown:ItemTemplate">
     *    <ws:contentTemplate>
     *       {{contentTemplate.itemData.item.title}}
     *    </ws:contentTemplate>
     * </ws:partial>
     * </pre>
     *
     * **Пример 3.** Контрол и шаблон contentTemplate настроены в отдельных WML-файлах.
     *
     * <pre class="brush: html">
     * <!-- file1.wml -->
     * <Controls.dropdown:Selector>
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/dropdown:ItemTemplate">
     *          <ws:contentTemplate>
     *             <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.dropdown:Selector>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * {{contentTemplate.itemData.item.title}}
     * </pre>
     */
    contentTemplate?: string;
    /**
     * @name Controls/dropdown:ItemTemplate#displayProperty
     * @cfg {String} Устанавливает имя поля элемента, данные которого будут отображены в шаблоне.
     * @remark
     * Опцию не используют, если задан пользовательский шаблон в опции {@link Controls/dropdown:ItemTemplate#contentTemplate contentTemplate}.
     * @default title
     */
    displayProperty?: string;
    /**
     * @name Controls/dropdown:ItemTemplate#marker
     * @cfg {Boolean} Когда опция установлена в значение true, активный элемент будет выделяться {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
     * @default true
     */
    marker?: boolean;
    /**
     * @name Controls/dropdown:ItemTemplate#iconAlign
     * @cfg {IconAlign} Устанавливает выравнивание иконки относительно элемента.
     * @default left
     */
    iconAlign?: string;
    /**
     * @name Controls/dropdown:ItemTemplate#multiLine
     * @cfg {Boolean} Определяет, может ли элемент отображаться в несколько строк.
     * @default false
     */
    multiLine?: boolean;
    /**
     * @name Controls/dropdown:ItemTemplate#additionalTextTemplate
     * @cfg {String|TemplateFunction|undefined} Устанавливает пользовательский шаблон, который отображается под основным контентом элемента и используется для вывода дополнительного текста (комментария).
     * @default undefined
     * @example
     * <pre class="brush: html; highlight: [9,10,11]">
     * <Controls.dropdown:Button source="{{_source}}">
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/dropdown:ItemTemplate"
     *                  multiLine="{{true}}"
     *                  itemData="{{itemData}}">
     *          <ws:additionalTextTemplate>
     *             <div>{{itemTemplate.itemData.item.get('comment')}}</div>
     *          </ws:additionalTextTemplate>
     *       </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.dropdown:Button>
     * </pre>
     * <pre class="brush: js">
     *    this._source = new Memory ({
     *       data: [
     *           { id: 1,
     *             title: 'Discussion',
     *             comment: 'Create a discussion to find out the views of other group members on this issue' },
     *           { id: 2,
     *             title: 'Idea/suggestion',
     *             comment: 'Offer your idea, which others can not only discuss, but also evaluate.
     *             The best ideas will not go unnoticed and will be realized' },
     *           { id: 3,
     *             title: 'Problem',
     *             comment: 'Do you have a problem? Tell about it and experts will help to find its solution' }
     *       ],
     *       keyProperty: 'id'
     *    });
     * </pre>
     */
    additionalTextTemplate?: string;
}
