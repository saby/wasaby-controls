/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */

export interface IOnlyPositiveOptions {
    onlyPositive?: boolean;
}

/**
 * @name Controls/_baseDecorator/interfaces/IOnlyPositive#onlyPositive
 * @cfg {Boolean} Определяет, будут ли отображаться только неотрицательные числа.
 * @default false
 * @remark
 * true - только неотрицательные числа.
 * false - все числа.
 * Важно! Если опция установлена в значение "true", и передано отрицательное значение, то отобразится модуль переданного значения
 * @example
 * В этом примере _inputValue в состоянии контрола будет хранить только неотрицательные числа.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.input:Number bind:value="_inputValue" onlyPositive="{{true}}"/>
 * </pre>
 */

/**
 * Интерфейс для контролов, которые поддерживают ввод неотрицательных чисел.
 * @public
 */
export default interface IOnlyPositive {
    readonly '[Controls/_baseDecorator/interfaces/IOnlyPositive]': boolean;
}
