/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import rk = require('i18n!Controls');
import cInstance = require('Core/core-instance');

interface IArgs {
    value: Date;
    doNotValidate?: boolean;
}

/**
 * На БЛ, минимальное значение для года - 1400.
 */
const MIN_YEAR_VALUE = 1400;
const additionalYears = 1000;
const MAX_YEAR_VALUE = new Date().getFullYear() + additionalYears;

/**
 * Функция проверяет дату и время на валидность.
 * @class Controls/_validate/Validators/IsValidDate
 * @public
 * @remark
 * Валидатор используется по умолчанию в платформенных полях ввода даты и времени, задавать его вручную не нужно.
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 *
 * Аргументы функции:
 *
 * * value — проверяемое значение.
 * * doNotValidate:Boolean — требуется ли валидация.
 *
 * Типы возвращаемых значений:
 *
 * * true — значение прошло проверку на валидность.
 * * String — значение не прошло проверку на валидность, возвращается текст сообщения об ошибке.
 *
 * @example
 * <pre>
 * <Controls.validate:InputContainer name="InputValidate">
 *     <ws:validators>
 *         <ws:Function value="{{_isValidDate}}">Controls/validate:isValidDate</ws:Function>
 *     </ws:validators>
 *     <ws:content>
 *         <Controls.input:Text bind:value="_isValidDate"/>
 *     </ws:content>
 * </Controls.validate:InputContainer>
 * </pre>
 */
// todo: will be fixed by https://online.sbis.ru/opendoc.html?guid=9aea41a1-bac1-47b9-a2b5-fa81a3a2e979
function isValidDateDefault(date: Date): boolean {
    // If date is Invalid Date, "instanceof Date" will return true, so check getTime
    return (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date.getFullYear() >= MIN_YEAR_VALUE &&
        date.getFullYear() <= MAX_YEAR_VALUE
    );
}

export default function (args: IArgs): boolean | string {
    if (args.doNotValidate || !args.value || isValidDateDefault(args.value)) {
        return true;
    }

    if (cInstance.instanceOfModule(args.value, 'Types/entity:Date')) {
        return rk('Дата заполнена некорректно');
    } else if (cInstance.instanceOfModule(args.value, 'Types/entity:Time')) {
        return rk('Время заполнено некорректно');
    }

    return rk('Дата или время заполнены некорректно');
}
