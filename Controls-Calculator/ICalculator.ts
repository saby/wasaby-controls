import { IControlOptions } from 'UI/Base';

/**
 * @typedef {String} IViewMode
 * @description Допустимые значения для опции {@link Controls-Calculator/ICalculator#viewMode viewMode}.
 * @variant standart виртуальная клавиатура содержит кнопки с цифрами и арифметическими операциями.
 * @variant extended виртуальная клавиатура содержит кнопки с цифрами, арифметическими операциями и операциями для работы с памятью.
 */
export type IViewMode = 'standart' | 'extended';

export interface ICalculatorOptions extends IControlOptions {
    /**
     * @name Controls-Calculator/ICalculator#viewMode
     * @cfg {Controls-Calculator/ICalculator/IViewMode.typedef} Определяет набор элементов на виртуальной клавиатуре.
     * @default standart
     * @example
     * В данном примере показано, как задавать режим отображения калькулятора
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Calculator.View
     *    viewMode="extended" />
     * </pre>
     */
    viewMode: IViewMode;

    /**
     * @name Controls-Calculator/ICalculator#value
     * @cfg {number|string|null} Значение в поле ввода калькулятора.
     * @example
     * В данном примере показано, как задать начальное значение в поле ввода калькулятора
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Calculator.View
     *    value="25386"/>
     * </pre>
     */
    value: string;
}

/**
 * @event Controls-Calculator/ICalculator#valueChanged Происходит при клике по кнопку "=" на калькуляторе.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {string} value результат вычисления.
 * @example
 * В этом примере показано, как получить результат всчисления калькулятора.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls-Calculator.View
 *     on:valueChanged="_CalculatorValueChangedHandler()">
 * </Calculator.View>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * protected _CalculatorValueChangedHandler(event: Event, value: string): void {
 *     ...
 * }
 * </pre>
 */

/**
 * Интерфейс для контролов "Калькулятор".
 * @public
 */
export default interface ICalculator {
    readonly '[Controls-Calculator/ICalculator]': boolean;
}
