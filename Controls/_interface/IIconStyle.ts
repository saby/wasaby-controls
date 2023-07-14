/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} TIconStyle
 * @description Значения для стиля отображаения иконки.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant label
 * @variant default
 * @variant link
 * @variant contrast
 * @variant unaccented
 * @variant brand
 * @variant string
 */
export type TIconStyle =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'label'
    | 'default'
    | 'link'
    | 'contrast'
    | 'unaccented'
    | 'forTranslucent'
    | 'readonly'
    | 'brand'
    | string;

export interface IIconStyleOptions {
    iconStyle?: TIconStyle;
}

/**
 * Интерфейс для контролов, которые поддерживают разные цвета иконок
 * @public
 */
export default interface IIconStyle {
    readonly '[Controls/_interface/IIconStyle]': boolean;
}
/**
 * @name Controls/_interface/IIconStyle#iconStyle
 * @cfg {TIconStyle} Стиль отображения иконки.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant label
 * @variant default
 * @variant link
 * @variant contrast
 * @variant unaccented
 * @variant brand
 * @variant string
 * @default secondary
 * @remark
 * Цвет иконки задается константой из стандартного набора цветов, который определен для текущей темы оформления.
 * @demo Controls-demo/Buttons/IconStyles/Index
 * @example
 * Кнопка с иконкой по умолчанию.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button icon="icon-Add" viewMode="outlined"/>
 * </pre>
 * Кнопка с иконкой в стиле "success".
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button icon="icon-Add" iconStyle="success" viewMode="outlined"/>
 * </pre>
 * @see Icon
 */

/*
 * @name Controls/_interface/IIconStyle#iconStyle
 * @cfg {TIconStyle} Icon display style.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant default
 * @variant link
 * @default secondary
 * @example
 * Button with default icon style.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="outlined"/>
 * </pre>
 * Button with success icon style.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" iconStyle="success" viewMode="outlined"/>
 * </pre>
 * @see Icon
 */
