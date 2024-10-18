/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */

/**
 * Интерфейс редакторов фильтра, которые могут перемещаться между блоком "Отбираются" и "Можно отобрать".
 * @public
 */
export default interface IVisibilityChanged {
    readonly '[Controls/_filterPopup/interface/IVisibilityChanged]': boolean;
}
/**
 * @name Controls/_filterPopup/interface/IVisibilityChanged#visibilityChanged
 * @event Происходит при клике на элемент.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @remark
 * Событие уведомляет панель, что необходимо переместить контрол в основной блок.
 * @example
 * Пример использования контрола на панели фильтра
 * <pre class="brush: html">
 * <Controls.filterPopup:Link caption="Author" on:visibilityChanged="_visibilityChangedHandler()"/>
 * </pre>
 *
 * <pre class="brush: js">
 * private _visibilityChangedHandler(event, value) {
 *      if (options.isVisibleUpdate) {
 *          this._notify('visibilityChanged', [value]);
 *      }
 * }
 * </pre>
 */
