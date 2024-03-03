import { TemplateFunction } from 'UI/Base';

/**
 * Интерфейс для контролов-цветных вкладок.
 * @interface Controls-TabsLayout/_colored/IColoredOptions
 * @public
 */
export interface IColoredOptions {
    items?: IItemTab[];
    selectedKey?: string | number;
    headerContentTemplate?: TemplateFunction | string;
    backgroundFill?: string;
    maxHeaderWidth?: number;
    propStorageId?: string;
}

export interface IItemTab {
    key: string;
    title?: string;
    itemTemplate?: TemplateFunction;
    headTemplate?: TemplateFunction;
    templateOptions?: object;
    headTemplateOptions?: object;
    backgroundStyle: string;
    counter?: number;
}

/**
 * @typedef {Object} ItemTab
 * @variant key Ключ, уникально идентифицирующий элемент коллекции.
 * @variant title Заголовок вкладки.
 * @variant backgroundStyle Стиль {@link https://wi.sbis.ru/docs/js/Controls/interface/IFontColorStyle/options/fontColorStyle/ цвета} вкладки.
 * @variant itemTemplate Содержит разметку для контентной области вкладки.
 * @variant templateOptions Опции для контентной области вкладки.
 * @variant headTemplate Содержит разметку для заголовка вкладки (не обязательное поле).
 * @variant counter Счётчик, который отображается рядом с заголовков вкладки (не обязательное поле).
 * @variant icon Иконка, которая отображается вместо текста, если у зафикированной вкладки не хватает места
 * Применяется с шаблоном Controls-TabsLayout/colored:HeadCounter для
 * {@link https://wi.sbis.ru/docs/js/Controls-TabsLayout/_colored/View/options/headTemplate headTemplate}.
 * Пример использования смотрите {@link https://wi.sbis.ru/docs/js/Controls-TabsLayout/_colored/View/options/headTemplate здесь}.
 * @variant headTemplateOptions Опции для заголовка вкладки.
 */

/**
 * @name Controls-TabsLayout/_colored/IColoredOptions#items
 * @cfg {Array.<ItemTab>} Массив элементов.
 * @example
 * Controls-TabsLayout.colored:View/BaseView с четырьмя вкладками:
 * <pre>
 *   <Controls-TabsLayout.colored:View
 *           class="controlsDemo__height500"
 *           bind:selectedKey="_selectedKey">
 *               <ws:items>
 *                   <ws:Array>
 *                       <ws:Object key="1" title="Просрочено" backgroundStyle="primary">
 *                           <ws:headTemplate>
 *                               <div>Кастомная вкладка</div>
 *                           </ws:headTemplate>
 *                           <ws:itemTemplate>
 *                               <div>Контент вкладки "Просрочено"</div>
 *                           </ws:itemTemplate>
 *                       </ws:Object>
 *                       <ws:Object key="2" title="Сделать" backgroundStyle="link">
 *                           <ws:itemTemplate>
 *                               <div>Контент вкладки "Сделать"</div>
 *                           </ws:itemTemplate>
 *                       </ws:Object>
 *                       <ws:Object key="3" title="Выполнено" backgroundStyle="success">
 *                           <ws:itemTemplate>
 *                               <Controls.scroll:Container
 *                                       attr:style="height: 100%"
 *                                       scrollbarVisible="{{false}}">
 *                                   <div class="controlsDemo__height500">Контент вкладки "Выполнено"</div>
 *                               </Controls.scroll:Container>
 *                           </ws:itemTemplate>
 *                       </ws:Object>
 *                       <ws:Object key="4" title="Сегодня" backgroundStyle="warning">
 *                           <ws:itemTemplate>
 *                               <div>Контент вкладки "Сегодня"</div>
 *                           </ws:itemTemplate>
 *                       </ws:Object>
 *                   </ws:Array>
 *               </ws:items>
 *   </Controls-TabsLayout.colored:View>
 * </pre>
 */
/**
 * @name Controls-TabsLayout/_colored/IColoredOptions#headerContentTemplate
 * @cfg {content|string} Контент располагающийся слева от вкладок.
 * @demo Controls-TabsLayout-demo/colored/BaseView/HeaderContentTemplate/Index
 * @example
 * <pre>
 *   <Controls-TabsLayout.colored:View
 *       class="controlsDemo__height500"
 *       bind:selectedKey="_selectedKey">
 *       <ws:headerContentTemplate>
 *          <div>
 *              <!-- Если нужно показать кнопку разворота, то она передается в поле expandButtonTemplate-->
 *              <ws:partial
 *                  template="{{ headerContentTemplate.expandButtonTemplate }}"
 *                  />
 *              Пользовательский контент
 *          </div>
 *       </ws:headerContentTemplate>
 *       <ws:items>
 *           <ws:Array>
 *               <ws:Object key="1" title="Просрочено" backgroundStyle="primary">
 *                   <ws:itemTemplate>
 *                       <div>Контент вкладки "Просрочено"</div>
 *                   </ws:itemTemplate>
 *               </ws:Object>
 *               <ws:Object key="2" title="Сделать" backgroundStyle="link">
 *                   <ws:itemTemplate>
 *                       <div>Контент вкладки "Сделать"</div>
 *                   </ws:itemTemplate>
 *               </ws:Object>
 *               <ws:Object key="3" title="Сегодня" backgroundStyle="warning">
 *                   <ws:itemTemplate>
 *                       <div>Контент вкладки "Сегодня"</div>
 *                   </ws:itemTemplate>
 *               </ws:Object>
 *           </ws:Array>
 *       </ws:items>
 *   </Controls-TabsLayout.colored:View>
 * </pre>
 */

/**
 * @name Controls-TabsLayout/_colored/IColoredOptions#backgroundFill
 * @cfg {content|string} Позволяет установить расположение фона на вкладках.
 * @default full
 * @variant full Фон на заголовках и на контентной области вкладок.
 * @variant header Фон только на заголовках вкладок.
 * @example
 * В данном примере установим заливку фона только на заголовках вкладок.
 * <pre class="brush: html">
 * <!-- WML -->
 * <TabsLayout.colored:View
 *    backgroundFill="header" />
 * </pre>
 * @demo Engine-demo/TabsLayout/colored/BaseView/BackgroundFill/Index
 */

/**
 * @name Controls-TabsLayout/_colored/IColoredOptions#propStorageId
 * @cfg {String} Уникальный идентификатор, по которому будут сохраняться текущая выбранная вкладка.
 */

/**
 * @name Controls-TabsLayout/_colored/IColoredOptions#headTemplate
 * @cfg {content|string} Содержит разметку для заголовков вкладки (не обязательное поле).
 * {@link https://wi.sbis.ru/docs/js/TabsLayout/baseView/typedefs/ItemTab headTemplate}, заданный на item'е, имеет приоритет выше.
 * @demo Engine-demo/TabsLayout/colored/BaseView/HeadCounter/Index
 * @example
 * WML:
 * <pre>
 *     <TabsLayout.colored:View
 *       class="controlsDemo__height500"
 *       bind:selectedKey="_selectedKey"
 *       headTemplate="TabsLayout/colored:HeadCounter">
 *       <ws:items>
 *           <ws:Array>
 *               <ws:Object key="1" title="Просрочено" backgroundStyle="primary">
 *                   <ws:itemTemplate>
 *                       <div>Контент вкладки "Просрочено"</div>
 *                   </ws:itemTemplate>
 *               </ws:Object>
 *               <ws:Object key="2" title="Сделать" backgroundStyle="link">
 *                   <ws:itemTemplate>
 *                       <div>Контент вкладки "Сделать"</div>
 *                   </ws:itemTemplate>
 *               </ws:Object>
 *           </ws:Array>
 *       </ws:items>
 *   </TabsLayout.colored:View>
 * </pre>
 */

/**
 * @name Controls-TabsLayout/_colored/IColoredOptions/typedefs/ItemTab#headTemplate
 * @cfg {content|string} Содержит разметку для заголовка вкладки (не обязательное поле).
 * headTemplate, заданный на item'е, имеет приоритет выше.
 * @demo Engine-demo/TabsLayout/colored/BaseView/HeadCounter/Index
 * @example
 * В данном примере установим контентную область headTemplate, используя раскладку заголовка со счётчиком.
 * WML:
 * <pre>
 *     <ws:Object key="1" backgroundStyle="primary" title="Основной" counter="20"
 *                headTemplate="TabsLayout/colored:HeadCounter">
 *         <ws:itemTemplate>
 *             <div>Контент вкладки "Основной"</div>
 *         </ws:itemTemplate>
 *     </ws:Object>
 * </pre>
 */

/**
 * @name Controls-TabsLayout/_colored/IColoredOptions#maxHeaderWidth
 * @cfg {number} Максимальная ширина текста заголовка вкладки в px.
 * @demo Engine-demo/TabsLayout/colored/BaseView/MaxHeaderWidth/Index
 * @default undefined
 * @remark
 * Задайте для равномерной ширины вкладок в развёрнутом состоянии.
 */
