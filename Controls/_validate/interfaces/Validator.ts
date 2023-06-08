/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
type TValidatorResult = string | boolean | IValidator;
/**
 * Тип для функций валидации.
 * @public
 */
export type TValidator<T> = (
    args: T
) => Promise<TValidatorResult> | TValidatorResult;

/**
 * Интерфейс возвращаемого типа валидации.
 * @public
 */
export interface IValidator {
    /**
     * Путь до шаблона, по которому будет отображено содержимое валидатора
     */
    templateName?: string;
    /**
     * Опции для шаблона, который будет передан в валидатор
     */
    templateOptions?: Record<string, unknown>;
}
