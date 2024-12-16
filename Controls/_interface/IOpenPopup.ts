/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Интерфейс для контролов, которые имеют возможность открывать диалоговое окно.
 * @public
 */
export default interface IOpenPopup {
    readonly '[Controls/_interface/IOpenPopup]': boolean;
    openPopup(): void;
}

/**
 * Открывает диалоговое окно контрола.
 * @name Controls/_interface/IOpenPopup#openPopup
 * @function
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dateRange:Selector name='dateRange'/>
 * <Controls.Button on:click="_openPopup()" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * openPopup() {
 *    this._children.dateRange.openPopup();
 * }
 * </pre>
 */
