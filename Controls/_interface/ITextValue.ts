/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * Интерфейс контролов, которые могут поставлять текстовое значение.
 * @public
 */
export default interface ITextValue {
    readonly '[Controls/_interface/ITextValue]': boolean;
}
/**
 * @event textValueChanged Происходит при изменении набора выбранной коллекции.
 * @name Controls/_interface/ITextValue#textValueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Декскриптор события.
 * @param {String} textValue Строка, сформированная из выбранных записей.
 *
 * @example
 * В следующем примере создается Controls/lookup:Selector и демонстрируется сценарий использования.
 * <pre>
 * <!-- WML -->
 * <Controls.lookup:Selector
 *    source="{{_source}}"
 *    keyProperty="id"
 *    on:textValueChanged="onTextValueChanged()" />
 * </pre>
 * <pre>
 * // JavaScript
 * onTextValueChanged: function(e, textValue) {
 *    USER.set('selectedItems', textValue);
 * }
 * </pre>
 */
/*
 * @event Occurs when changing the set of the selected collection.
 * @name Controls/_interface/ITextValue#textValueChanged
 * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
 * @param {String} textValue String formed from selected entries.
 *
 * @example
 * The following example creates Controls/lookup:Selector and shows how to handle the event.
 * WML:
 * <pre>
 *    <Controls.lookup:Selector
 *       source="{{_source}}"
 *       keyProperty="id"
 *       on:textValueChanged="onTextValueChanged()">
 *    </Controls.lookup:Selector>
 * </pre>
 * JS:
 * <pre>
 *    onTextValueChanged: function(e, textValue) {
 *       USER.set('selectedItems', textValue);
 *    }
 * </pre>
 */
