/**
 * Интерфейс, позволяющий ограничить количество знаков после запятой в числе, введённом в поле ввода.
 * @public
 */
export interface IPrecisionOptions {
    /**
     * Количество знаков после запятой.
     * @demo Controls-Input-demo/InputConnected/Number/Precision
     */
    precision?: number;
}
