/**
 * Тип для функций валидации.
 * @public
 */
export type TValidatorFn = (value: unknown) => boolean | string | Promise<boolean | string>;

/**
 * Интерфейс, позволяющий установить неодходимость ввода данных в поле ввода.
 * @public
 */
export interface IValidateOptions {
    /**
     * Массив функций валидации выбранного значения.
     * @demo Controls-Input-demo/InputConnected/Text/Validators
     */
    validators?: TValidatorFn[];
}
