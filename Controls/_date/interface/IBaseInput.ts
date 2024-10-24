/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
export interface IBaseInputOptions {
    value: Date;
}

/**
 * @name Controls/_date/interface/IBaseInput#value
 * @cfg {Date} Дата, которую пользователь ввел в поле ввода.
 * @default null
 * @remark Если вы не обновите параметр "value", то не сможете ничего ввести в поле.
 * Вам необходимо подписаться на событие "valueChanged" и обновить значение, которое передается в контрол.
 * Для упрощения вы можете использовать синтаксис биндинга.
 * @example
 * В этом примере вы осуществляете привязку _inputValue в состоянии контрола к значению поля ввода.
 * В любое время жизненного цикла контрола, _inputValue будет содержать текущее значение поля ввода.
 * <pre>
 *    <Controls.date:BaseInput bind:value="_inputValue" />
 *    <Controls.Button on:click="_sendButtonClick()" />
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions>{
 *       ...
 *       _inputValue: new Date(),
 *
 *       _sendButtonClick() {
 *          this._sendData(this._inputValue);
 *       }
 *       ...
 *  };
 * </pre>
 */

/**
 * @event valueChanged Происходит при изменении значения поля ввода.
 * @name Controls/_date/interface/IBaseInput#valueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Date} value Новое значение поля ввода.
 * @param {String} displayValue Текстовое значение поля ввода.
 * @remark
 * Это событие предназначено для реагирования на изменения, вносимые пользователем в поле ввода.
 * Значение, возвращаемое в событии, не вставляется в контрол, если вы не передадите его обратно в поле в качестве опции.
 * Обычно, вместо этого используется синтаксис биндинга. Пример ниже иллюстрирует разницу.
 * @example
 * В этом примере покажем, как 'привязать' значение контрола к полю.
 * В первом поле мы делаем это вручную, используя событие valueChanged. Во втором поле мы используем синтаксис биндинга.
 * Оба поля в этом примере будут иметь одинаковое поведение.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.date:Input value="{{_fieldValue}}" on:valueChanged="_valueChangedHandler()"/>
 * <Controls.date:Input bind:value="_anotherFieldValue"/>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    _fieldValue: null,
 *    _valueChangedHandler(event, value, displayValue) {
 *       this._fieldValue = value;
 *       this._saveToDatabase(displayValue);
 *    },
 *    _anotherFieldValue: null
 * }
 * </pre>
 */

/**
 * @event inputCompleted Происходит при завершении ввода в поле (поле потеряло фокус или пользователь нажал клавишу "enter").
 * @name Controls/_date/interface/IBaseInput#inputCompleted
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Date} value Значение поля.
 * @param {String} displayValue Текстовое значение поля.
 * @remark
 * Это событие можно использовать в качестве триггера для проверки поля или отправки введенных данных в другой контрол.
 * @example
 * В этом примере мы подписываемся на событие inputCompleted и сохраняем значение поля в первой базе данных, а отображаемое значение поля во второй базе данных.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls._input.Text on:inputCompleted="_inputCompletedHandler()" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    _inputCompletedHandler(event, value, displayValue) {
 *       this._saveEnteredValueToDabase1(value);
 *       this._saveEnteredValueToDabase2(displayValue);
 *    }
 * }
 * </pre>
 */

/**
 * Интерфейс ввода даты/времени.
 *
 * @public
 */
export interface IBaseInput {
    readonly '[Controls/_date/interface/IBaseInput]': boolean;
}
