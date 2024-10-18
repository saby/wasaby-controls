/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/columns:View многоколоночном списке}.
 *
 * @class Controls/_columns/interface/ItemTemplate
 * @implements Controls/list:IBaseItemTemplate
 * @see Controls/columns:View#itemTemplate
 * @see Controls/columns:View#itemTemplateProperty
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [3-5]">
 * <!-- WML -->
 * <Controls.columns:View source="{{_viewSource}}"">
 *    <ws:itemTemplate>
 *      <ws:partial template="Controls/columns:ItemTemplate"
 *                  highlightOnHover="{{false}}"
 *                  shadowVisibility="hidden"
 *                  itemActionsClass="controls-itemActionsV_position_topRight"/>
 *    </ws:itemTemplate>
 * </Controls.columns:View>
 * </pre>
 * @public
 */

/**
 * @public
 * @name Controls/_columns/interface/ItemTemplate#tagStyle
 * @cfg {Controls/interface:TTagStyle.typedef} Стиль отображения тега.
 * @demo Controls-demo/list_new/ColumnsView/TagStyle/Index
 */

/**
 * @public
 * @name Controls/_columns/interface/ItemTemplate#contentPadding
 * @cfg {Controls/interface:IItemPadding.typedef} Внутренние отступы записи.
 * @demo Controls-demo/list_new/ColumnsView/ContentPadding/Index
 */

/**
 * @typedef {String} Controls/_columns/interface/ItemTemplate/TShadowVisibility
 * @description Допустимые значения для опции {@link shadowVisibility}.
 * @variant visible Тень показывается при наведении.
 * @variant hidden Тень не показывается при наведении.
 */

/**
 * @public
 * @name Controls/_columns/interface/ItemTemplate#shadowVisibility
 * @cfg {Controls/_columns/interface/ItemTemplate/TShadowVisibility.typedef} Видимость тени элемента при наведении.
 * @default visible
 */
