/**
 * Интерфейс, позволяющий установить максимальное и минимальное количество введённых символов.
 * @public
 */
export interface ILengthOptions {
    /**
     * Задает максимальное и минимальное количество введённых символов.
     * @demo Controls-Input-demo/InputConnected/Text/Length
     */
    length?: {
        minLength?: number;
        maxLength?: number;
    };
}
