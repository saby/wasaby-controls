/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
export interface IMaxLengthOptions {
    maxLength?: number;
}

/**
 * Интерфейс контролов, с вводом определенного количества символов.
 * @interface Controls/_input/interface/IMaxLength
 * @public
 */

/**
 * @name Controls/_input/interface/IMaxLength#maxLength
 * @cfg {Number} Максимальное количество символов, которое может ввести пользователь вручную в поле.
 * @remark
 * Когда количество символов достигает максимума, тогда последующие символы в поле не добавляются.
 * @demo Controls-demo/Input/MaxLength/Index
 */
