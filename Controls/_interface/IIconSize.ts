/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Значения для размеров иконки
 * @typedef {String} TIconSize
 * @variant 2xs минимальный
 * @variant xs уменьшенный
 * @variant s малый
 * @variant st средний для SVG иконок (временное значение, использовать с осторожностью)
 * @variant m средний
 * @variant l большой
 * @variant default по-умолчанию
 */
export type TIconSize = '2xs' | 'xs' | 's' | 'st' | 'm' | 'l' | 'default';

export interface IIconSizeOptions {
    iconSize?: TIconSize;
}

/**
 * Интерфейс для контролов, которые поддерживают разные размеры иконок
 * @public
 */
export default interface IIconSize {
    readonly '[Controls/_interface/IIconSize]': boolean;
}
/**
 * @name Controls/_interface/IIconSize#iconSize
 * @cfg {TIconSize} Размер иконки.
 * @variant 2xs минимальный
 * @variant xs уменьшенный
 * @variant s малый
 * @variant st средний для SVG иконок (временное значение, использовать с осторожностью)
 * @variant m средний
 * @variant l большой
 * @variant default по-умолчанию
 * @remark
 * Размер иконки задается константой из стандартного набора размеров, который определен для текущей {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления}.
 * @demo Controls-demo/Buttons/SizesAndHeights/Index
 * @example
 * Кнопка с размером иконки по умолчанию.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button icon="icon-Add" viewMode="outlined"/>
 * </pre>
 * Кнопка с иконкой большого размера (l).
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button icon="icon-Add" iconSize="l" viewMode="outlined"/>
 * </pre>
 * @see Icon
 */

/*
 * @name Controls/_interface/IIconSize#iconSize
 * @cfg {TIconSize} Icon display Size.
 * @variant s
 * @variant m
 * @variant l
 * @variant default
 * @example
 * Button with default icon size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="outlined"/>
 * </pre>
 * Button with large size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" iconSize="l" viewMode="outlined"/>
 * </pre>
 * @see Icon
 */
