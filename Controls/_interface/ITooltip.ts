/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface ITooltipOptions {
    tooltip?: string;
}

/**
 * Интерфейс всплывающей подсказки.
 * @public
 */

/*
 * Interface for the tooltip.
 * @public
 * @author Мочалов М.А.
 */
export default interface ITooltip {
    readonly '[Controls/_interface/ITooltip]': boolean;
}
/**
 * @name Controls/_interface/ITooltip#tooltip
 * @cfg {String} Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
 * @default undefined
 * @remark Атрибут "Title" добавляется в корневой узел контрола и всплывающая подсказка браузера по умолчанию отображается при наведении курсора мыши.
 * @example
 * Подсказка "Add".
 * <pre class="brush: html">
 * <!-- WML -->
 * <ControlsDirectory.Control tooltip="Add"/>
 * </pre>
 */

/*
 * @name Controls/_interface/ITooltip#tooltip
 * @cfg {String} Text of the tooltip shown when the control is hovered over.
 * @default Undefined
 * @remark "Title" attribute added to the control's root node and default browser tooltip is shown on hover.
 * @example
 * Tooltip is "Add".
 * <pre>
 *    <ControlsDirectory.Control tooltip="Add"/>
 * </pre>
 */
