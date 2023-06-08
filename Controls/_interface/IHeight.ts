/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IHeightOptions {
    inlineHeight?: string;
}

/**
 * Интерфейс для контролов, которые поддерживают разные значения высоты.
 * @public
 */
/*
 * Interface for control, which has different height values
 *
 * @public
 */
export default interface IHeight {
    readonly '[Controls/_interface/IHeight]': boolean;
}
/**
 * @name Controls/_interface/IHeight#inlineHeight
 * @cfg {String} Высота контрола.
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant default
 * @default m
 * @demo Controls-demo/Buttons/SizesAndHeights/Index
 * @demo Controls-demo/Input/SizesAndHeights/Index
 * @remark
 * Высота задается константой из стандартного набора размеров, который определен для текущей темы оформления.
 * @example
 * Кнопка большого размера (l).
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button icon="icon-Add" inlineHeight="l" viewMode="outlined"/>
 * </pre>
 * @remark
 * Строковым значениям опции inlineHeight соответствуют числовые (px), которые различны для каждой темы оформления.
 * @see Icon
 */

/*
 * @name Controls/_interface/IHeight#inlineHeight
 * @cfg {String} Control height value
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant default
 * @example
 * Button with large height.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" inlineHeight="l" viewMode="outlined"/>
 * </pre>
 * @see Icon
 */
