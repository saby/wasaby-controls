/**
 * Идентификатор поля типа
 * @public
 */
export const DISCRIMINATOR_FIELD = 'element_id';

/**
 * Идентификатор поля значения
 */
export const TYPE_VALUE_FIELD = 'data';

/**
 * Значение вариативного типа
 * @public
 */
export interface IVariantTypeValue {
    [DISCRIMINATOR_FIELD]: string;
    [TYPE_VALUE_FIELD]: unknown;
}
