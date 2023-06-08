/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
/**
 * Шаблон, который по умолчанию используется для отображения элементов в {@link Controls/grid:View таблице}.
 *
 * @class Controls/_grid/interface/ItemTemplate
 * @implements Controls/list:IBaseItemTemplate
 * @see Controls/interface/IGridItemTemplate#itemTemplate
 * @see Controls/interface/IGridItemTemplate#itemTemplateProperty
 * @see Controls/grid:View
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [3-5]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate" marker="{{false}}" scope="{{ itemTemplate }}" />
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/item/ здесь}.
 * @public
 */

/**
 * @name Controls/_grid/interface/ItemTemplate#fontColorStyle
 * @cfg {TFontColorStyle} Стиль цвета текста записи.
 * @remark
 * {@link Controls/_grid/display/interface/IColumn#fontColorStyle Стиль цвета текста ячейки} имеет больший приоритет, чем стиль цвета текста записи.
 * Стиль цвета текста задается константой из стандартного набора цветов, который определен для текущей темы оформления.
 */
/**
 * @name Controls/_grid/interface/ItemTemplate#fontSize
 * @cfg {TFontSize} Размер шрифта записи.
 * @remark
 * {@link Controls/_grid/display/interface/IColumn#fontSize Размер шрифта ячейки} имеет больший приоритет, чем стиль размер шрифта текста записи.
 * Размер шрифта задается константой из стандартного набора размеров шрифта, который определен для текущей темы оформления.
 * @default l
 */
/**
 * @name Controls/_grid/interface/ItemTemplate#fontWeight
 * @cfg {TFontWeight} Насыщенность шрифта.
 * @default "default".
 * @remark
 * {@link Controls/_grid/display/interface/IColumn#fontWeight Насыщенность шрифта ячейки} имеет больший приоритет, чем Насыщенность шрифта записи.
 */

/**
 * @name Controls/_grid/interface/ItemTemplate#borderVisibility
 * @cfg {Controls/display/TBorderVisibility.typedef} Видимость рамки вокруг записи.
 * @remark применяется в списках с отступами между записями.
 * @default hidden
 * @see shadowVisibility
 */

/**
 * @name Controls/_grid/interface/ItemTemplate#borderStyle
 * @cfg {Controls/display/TBorderStyle.typedef} Цвет рамки вокруг записи.
 * @see borderVisibility
 */

/**
 * @name Controls/_grid/interface/ItemTemplate#shadowVisibility
 * @cfg {Controls/display/TShadowVisibility.typedef} Видимость тени вокруг записи.
 * @remark применяется в списках с отступами между записями.
 * @default hidden
 * @see borderVisibility
 */
