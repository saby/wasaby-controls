/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
export default interface IValueOptions {
    value: Date | null | string;
}

/**
 * Интерфейс для контролов, которые поддерживают возможность ввода и выбора даты.
 *
 * @interface Controls/_date/interface/IValue
 * @public
 */

/**
 * @name Controls/_date/interface/IValue#value
 * @cfg {Date} Выбранная дата
 * @example
 * WML:
 * <pre>
 *  <Controls.date:Selector value="{{ _value }}" />
 * </pre>
 * JS:
 * <pre>
 *  _value: Date = new Date(2021, 0);
 * </pre>
 */

/**
 * @event valueChanged Происходит при изменении значения поля ввода.
 * @name Controls/_date/interface/IValue#valueChanged
 * @param {Event} eventObject Дескриптор события.
 * @param {Date} value Новое значение поля ввода.
 * @param {String} displayValue Текстовое значение поля ввода.
 */

/**
 * @event inputCompleted Происходит при завершении ввода. Завершение ввода — это контрол потерял фокус, или пользователь нажал клавишу "Enter".
 * @name Controls/_date/interface/IValue#inputCompleted
 * @param {Event} eventObject Дескриптор события.
 * @param {Date} value Значение поля ввода.
 * @param {String} displayValue Текстовое значение поля ввода.
 */
