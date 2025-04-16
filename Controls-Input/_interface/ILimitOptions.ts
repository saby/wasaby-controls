/**
 * Интерфейс, определяющий диапазон допустимых значений.
 * @public
 */
export interface ILimitOptions {
    /**
     * Задает минимальное и максимальное значение для поля ввода.
     * @demo Controls-Input-demo/InputConnected/Money/Limit
     */
    limit?: {
        minValue?: number;
        maxValue?: number;
    };
}
