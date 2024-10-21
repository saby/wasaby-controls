import rk = require('i18n!Controls-Input');

interface IValue {
    value: unknown;
}

/**
 * Функция проверяет, является ли введенное значение безопасным целым числом.
 * @public
 */
function SafeIntegerValidator(res: IValue): boolean | string {
    if (Number.isNaN(res.value)) {
        // не имеет смысла выводить сообщение на нечисловые значения
        return false;
    }
    if (Number.isSafeInteger(res.value) || !res.value) {
        return true;
    }
    return rk('Введенное значение превышает максимально допустимый размер для поля "Число"');
}

export { SafeIntegerValidator };
