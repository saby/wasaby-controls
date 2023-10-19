/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
/**
 * Данные, которые возвращаются функцией {@link Controls/_input/interface/IValue#inputCallback inputCallback}.
 * @public
 */
export interface IFieldData {
    /**
     * Положение каретки.
     */
    position: number;
    /**
     * Значение, которое будет отображено в поле.
     */
    displayValue: string;
}

/**
 * Данные, приходящие в функцию обратного вызова {@link Controls/_input/interface/IValue#inputCallback inputCallback}.
 * @extends Controls/_input/interface/IFieldData
 * @public
 */
export interface ICallbackData<T> extends IFieldData {
    value: T;
}

/**
 * @name Controls/_input/interface/ICallbackData#value
 * @cfg {*} Значение поля ввода.
 */

/**
 * @callback ICallback Определяет функцию обратного вызова, изменяющую обработку ввода.
 * @param {} T Тип значения поля ввода.
 * @param {ICallbackData} data данные основного процесса обработки ввода.
 * @return {Controls/_input/interface/IFieldData} Измененные данные.
 */
export type ICallback<T> = (data: ICallbackData<T>) => IFieldData;

export interface IValueOptions<T> {
    /**
     * @name Controls/_input/interface/IValue#value
     * @cfg {*|null} Значение поля ввода.
     * @remark
     * При установке опции value в контроле ввода, отображаемое значение всегда будет соответствовать её значению. В этом случае родительский контрол управляет отображаемым значением. Например, вы можете менять значение по событию {@link valueChanged}:
     *
     * <pre class="brush: html">
     * <Controls:input:Text value="{{_value}}" on:valueChanged="_handleValueChange()"/>
     * </pre>
     *
     * <pre class="brush: js">
     * export class Form extends Control<IControlOptions, void> {
     *     private _value: string = '';
     *
     *     private _handleValueChange(event: SyntheticEvent<Event>, value) {
     *         this._value = value;
     *     }
     * }
     * </pre>
     *
     * Пример можно упростить, воспользовавшись синтаксисом шаблонизатора {@link /doc/platform/developmentapl/interface-development/ui-library/options/#two-way-binding bind}:
     *
     * <pre class="brush: html">
     * <Controls:input:Text bind:value="_value"/>
     * </pre>
     *
     * Альтернатива - не задавать опцию value. Значение контрола будет кешироваться в контроле ввода:
     *
     * <pre class="brush: html">
     * <Controls.input:Text/>
     * </pre>
     *
     * Не рекомендуем использовать опцию для изменения поведения обработки ввода. Такой подход увеличит время перерисовки.
     *
     * Плохо:
     *
     * <pre class="brush: html">
     * <Controls:input:Text value="{{_value}}" on:valueChanged="_handleValueChange()"/>
     * </pre>
     *
     * <pre class="brush: js">
     * export class Form extends Control<IControlOptions, void> {
     *     private _value: string = '';
     *
     *     private _handleValueChange(event: SyntheticEvent<Event>, value) {
     *         his._value = value.toUpperCase();
     *     }
     * }
     * </pre>
     *
     * Лучшим подходом будет воспользоваться опцией {@link inputCallback}.
     *
     * Хорошо:
     * <pre class="brush: html">
     * <Controls:input:Text bind:value="_value" inputCallback="{{_toUpperCase}}"/>
     * </pre>
     * <pre class="brush: js">
     * class Form extends Control<IControlOptions, void> {
     *     private _value: string = '';
     *
     *     private _toUpperCase(data) {
     *         return {
     *             position: data.position,
     *             value: data.value.toUpperCase(),
     *             displayValue: data.displayValue.toUpperCase()
     *         }
     *     }
     * }
     * </pre>
     * @see valueChanged
     * @see inputCompleted
     * @demo Controls-demo/Input/Value/Index
     */
    value: T | null;

    /**
     * @name Controls/_input/interface/IValue#inputCallback
     * @cfg {Controls/input:ICallbackData} Функция обратного вызова, вызывается после основного процесса обработки входных данных.
     * @remark
     * Метод используется, когда требуется изменить поведение обработки ввода.
     * Из функции возвращаются измененные данные (см. {@link Controls/_input/interface/IFieldData}).
     * @demo Controls-demo/Input/InputCallback/Index
     */
    inputCallback: ICallback<T>;
}

/**
 * Интерфейс управления значением поля ввода.
 *
 * @public
 */
export interface IValue {
    readonly '[Controls/_input/interface/IValue]': boolean;
}

/**
 * @name Controls/_input/interface/IValue#valueChanged
 * @event Происходит при изменении отображаемого значения контрола ввода.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} value Значение контрола ввода.
 * @param {String} displayValue Отображаемое значение контрола ввода.
 * @remark
 * Событие используется в качестве реакции на изменения, вносимые пользователем.
 * @example
 * Контрол ввода пароля с информационной подсказкой. Подсказка содержит информацию о его безопасности.
 * <pre class="brush: html">
 * <Controls.input:Password name="password" on:valueChanged="_validatePassword()"/>
 * </pre>
 * <pre class="brush: js">
 * export class InfoPassword extends Control<IControlOptions, void> {
 *     private _validatePassword(event, value) {
 *         let lengthPassword: number = value.length;
 *         let cfg = {
 *             target: this._children.password,
 *             targetSide: 'top',
 *             alignment: 'end',
 *             message: null
 *         }
 *
 *         if (lengthPassword < 6) {
 *             cfg.message = 'Сложность пароля низкая';
 *         }
 *         if (lengthPassword >= 6 && lengthPassword < 10) {
 *             cfg.message = 'Сложность пароля средняя';
 *         }
 *         if (lengthPassword >= 10) {
 *             cfg.message = 'Сложность пароля высокая';
 *         }
 *
 *         this._notify('openInfoBox', [cfg], {
 *             bubbling: true
 *         });
 *     }
 * }
 * </pre>
 *
 * @see value
 * @see inputCompleted
 */
/**
 * @name Controls/_input/interface/IValue#inputCompleted
 * @event Происходит при завершении ввода. Завершение ввода — это контрол потерял фокус, или пользователь нажал клавишу "Enter".
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} value Значение контрола ввода.
 * @param {String} displayValue Отображаемое значение контрола ввода.
 * @remark
 * Событие используется в качестве реакции на завершение ввода пользователем. Например, проверка на валидность введенных данных или отправка данных в другой контрол.
 * @example
 * Подписываемся на событие inputCompleted и сохраняем значение поля в базе данных.
 * <pre class="brush: html">
 * <Controls.input:Text on:inputCompleted="_inputCompletedHandler()"/>
 * </pre>
 * <pre class="brush: js">
 * export class Form extends Control<IControlOptions, void> {
 *    ...
 *    private _inputCompletedHandler(event, value) {
 *        this._saveEnteredValueToDatabase(value);
 *    }
 *    ...
 * }
 * </pre>
 * @see value
 * @see valueChanged
 */
