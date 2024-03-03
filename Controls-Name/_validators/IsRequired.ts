import * as rk from 'i18n!Controls';
import { INameValue } from 'Controls-Name/_input/interface/IInput';

interface IArgs {
    value: INameValue;
    doNotValidate?: boolean;
}

/**
 * Функция проверяет наличие значения в поле ввода ФИО.
 * @public
 * @remark
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 *
 * Аргументы функции:
 *
 * * value:Object — проверяемое значение.
 * * doNotValidate:Boolean — требуется ли валидация.
 *
 * Типы возвращаемых значений:
 *
 * * true — значение прошло проверку на валидность.
 * * string — значение не прошло проверку на валидность, возвращается текст сообщения об ошибке.
 */
function validate(args: IArgs): boolean | string {
    if (args.doNotValidate) {
        return true;
    }

    let isEmpty = true;
    if (args.value instanceof Object) {
        Object.values(args.value).forEach((item) => {
            if (item.trim()) {
                isEmpty = false;
            }
        });
    }

    return isEmpty ? rk('Поле обязательно для заполнения') : true;
}

export default validate;
