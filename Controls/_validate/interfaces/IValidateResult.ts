/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
/**
 * Интерфейс ответа после валидации.
 * @public
 */

export default interface IValidateResult {
    /**
     * Массив ошибок.
     * @cfg {Boolean}
     */
    [key: number]: boolean;
    /**
     * Есть ли ошибки в результате валидации.
     * @cfg {Boolean}
     */
    hasErrors?: boolean;
}
