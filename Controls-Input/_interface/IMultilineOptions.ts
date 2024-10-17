/**
 * Интерфейс, определяющий минимальное и максимально количество строк в поле ввода.
 * @public
 */
export interface IMultilineOptions {
    /**
     * Определяет минимальное и максимально количество строк.
     * @demo Controls-Input-demo/InputConnected/Text/Multiline
     */
    multiline?: {
        minLines?: number;
        maxLines?: number;
    };
}
