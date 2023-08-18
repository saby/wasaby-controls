/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export type TValidationStatus = 'valid' | 'invalid' | 'invalidAccent';

export interface IValidationStatusOptions {
    validationStatus: TValidationStatus;
}

/**
 * Интерфейс контролов ввода, которые могут визуально отображать наличие ошибки, допущенной при вводе.
 * @public
 */
interface IValidationStatus {
    readonly '[Controls/_interface/IValidationStatus]': boolean;
}

export default IValidationStatus;

/**
 * @name Controls/_interface/IValidationStatus#validationStatus
 * @cfg {Enum} Статус валидации контрола.
 * @variant valid валидный контрол
 * @variant invalid подсвечивает контрол с ошибкой валидации. При получении фокуса контрола его внешний вид может измениться для акцентирования внимания на ошибке.
 * @variant invalidAccent подсвечивает контрол с ошибкой валидации так, как будто в нем установлен фокус. Используется только в случаях, когда нет возможности установить фокус в контрол.
 * @demo Controls-demo/Input/ValidationStatuses/Index
 */
