/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
export interface ICheckableOptions {
    value?: boolean;
}

/**
 * Интерфейс переключателя.
 *
 * @interface Controls/_interface/ICheckable
 * @public
 */

/*
 * Interface for 2-position control.
 *
 * @interface Controls/_interface/ICheckable
 * @public
 * @author Мочалов М.А.
 */
export interface ICheckable {
    readonly '[Controls/_interface/ICheckable]': boolean;
}
/**
 * @name Controls/_interface/ICheckable#value
 * @cfg {boolean} Текущее состояние.
 */

/**
 * Событие происходит при изменении значения.
 * @function
 * @name Controls/_interface/ICheckable#onValueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {boolean} value Новое значение.
 */

/*
 * @name Controls/_interface/ICheckable#value
 * @cfg {boolean} Current state.
 */

/**
 * @event valueChanged Происходит при изменении значения.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {boolean} value Новое значение.
 */

/*
 * @event Occurs when value changes.
 * @name Controls/_interface/ICheckable#valueChanged
 * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
 * @param {boolean} value New value.
 */
